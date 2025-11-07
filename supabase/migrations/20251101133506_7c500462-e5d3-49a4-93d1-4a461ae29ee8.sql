-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create materials table for academic content
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subject TEXT,
  file_url TEXT,
  file_type TEXT,
  semester TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chat_logs table for IET Bot
CREATE TABLE public.chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create bulletin_items table
CREATE TABLE public.bulletin_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Anyone can view roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notices
CREATE POLICY "Anyone can view notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Only admins can create notices" ON public.notices FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update notices" ON public.notices FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete notices" ON public.notices FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for materials
CREATE POLICY "Anyone can view materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Only admins can create materials" ON public.materials FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update materials" ON public.materials FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete materials" ON public.materials FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chat_logs
CREATE POLICY "Users can view own chat logs" ON public.chat_logs FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create chat logs" ON public.chat_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for contacts
CREATE POLICY "Anyone can create contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view contacts" ON public.contacts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update contacts" ON public.contacts FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for bulletin_items
CREATE POLICY "Anyone can view bulletin items" ON public.bulletin_items FOR SELECT USING (true);
CREATE POLICY "Only admins can create bulletin items" ON public.bulletin_items FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update bulletin items" ON public.bulletin_items FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete bulletin items" ON public.bulletin_items FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bulletin_items_updated_at BEFORE UPDATE ON public.bulletin_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign user role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Check if email is admin email and assign admin role
  IF NEW.email = 'suryanshteepa1@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert demo data for notices
INSERT INTO public.notices (title, content, category, priority) VALUES
('Mid-Semester Test 2 Schedule', 'MST 2 examinations will be conducted from November 5-12, 2025. Students are advised to check the detailed timetable on the academic portal.', 'exam', 'high'),
('Winter Break Announcement', 'The institute will be closed for winter break from December 20, 2025 to January 5, 2026. Classes will resume on January 6, 2026.', 'holiday', 'normal'),
('Workshop on AI/ML', 'A 3-day workshop on Artificial Intelligence and Machine Learning will be organized from November 15-17, 2025. Interested students can register at the department office.', 'event', 'normal');

-- Insert demo data for materials
INSERT INTO public.materials (title, description, category, subject, semester, file_type) VALUES
('Data Structures Notes - Unit 1', 'Comprehensive notes covering arrays, linked lists, stacks and queues', 'notes', 'Data Structures', '3rd', 'pdf'),
('Operating Systems PYQs 2024', 'Previous year question papers for OS subject from 2024 examinations', 'pyq', 'Operating Systems', '4th', 'pdf'),
('DBMS Lab Manual', 'Complete lab manual with all SQL queries and practicals for Database Management Systems', 'practical', 'Database Management', '5th', 'pdf'),
('Computer Networks Notes', 'Complete notes on OSI model, TCP/IP, routing protocols and network security', 'notes', 'Computer Networks', '5th', 'pdf'),
('Software Engineering MST Papers', 'Mid-semester test papers collection for Software Engineering', 'mst', 'Software Engineering', '6th', 'pdf');

-- Insert demo data for bulletin items
INSERT INTO public.bulletin_items (title, content, category, start_date, end_date) VALUES
('Class Timings - 3rd Semester', 'Monday-Friday: 9:00 AM - 4:00 PM, Saturday: 9:00 AM - 1:00 PM', 'schedule', '2025-11-01', '2025-12-31'),
('MST 2 Schedule', 'MST 2 examinations from November 5-12, 2025. Check detailed timetable on portal.', 'exam', '2025-11-05', '2025-11-12'),
('Diwali Break', 'Institute closed for Diwali celebrations', 'holiday', '2025-11-12', '2025-11-15'),
('Technical Fest - TechFusion 2025', 'Annual technical festival with coding competitions, robotics, and project exhibitions', 'event', '2025-12-01', '2025-12-03');

-- Insert demo chat logs
INSERT INTO public.chat_logs (session_id, message, response) VALUES
('demo-session-1', 'When will MST 2 start?', 'According to the academic calendar, MST 2 examinations will begin on November 5, 2025 and continue until November 12, 2025.'),
('demo-session-2', 'What are the class timings?', 'The regular class timings are Monday to Friday: 9:00 AM - 4:00 PM, and Saturday: 9:00 AM - 1:00 PM.'),
('demo-session-3', 'Is there any workshop on AI?', 'Yes! There is a 3-day workshop on Artificial Intelligence and Machine Learning scheduled from November 15-17, 2025. You can register at the department office.');