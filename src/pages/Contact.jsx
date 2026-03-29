import React from 'react';
import Seo from '../components/Seo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useCmsPage, useSubmitContact } from '../features/cms/hooks';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactPage = () => {
  const { data: pageData } = useCmsPage('contact');
  const { mutateAsync: submitContact, isLoading: isSubmitting } = useSubmitContact();
  const page = pageData?.data;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      await submitContact(data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Seo 
        title={page?.metaTitle || page?.title || 'Contact Us'}
        description={page?.metaDescription || 'Get in touch with RideVendor for car hire, car sales, and auto services. Contact us today for inquiries and bookings.'}
        image={page?.ogImage}
        url={page?.canonicalUrl || '/contact'}
        robots={page?.robotsDirective}
      />
      <div className="container px-4 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem]">
            <h2 className="text-2xl font-semibold text-primary mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Your Name"
                  placeholder="John Doe"
                  {...register('name')}
                  error={errors.name}
                />
                <Input 
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  error={errors.email}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Phone Number"
                  placeholder="+2348123456789"
                  {...register('phone')}
                  error={errors.phone}
                />
                <Input 
                  label="Subject"
                  placeholder="Inquiry about car rental"
                  {...register('subject')}
                  error={errors.subject}
                />
              </div>
              <Textarea 
                label="Your Message"
                placeholder="Tell us about your needs..."
                rows={5}
                {...register('message')}
                error={errors.message}
              />
              <Button 
                type="submit" 
                isLoading={isSubmitting}
                className="w-full"
                leftIcon={<Send size={18} />}
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8 md:p-12 rounded-[3rem]">
              <h2 className="text-2xl font-semibold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-white/70 text-sm">
                      Oniyangi Complex, OFFA GARAGE RAILWAY LINE,<br />
                      off Asa-Dam Road, Ilorin 240101, Kwara
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-white/70 text-sm">+2348144123316</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-white/70 text-sm">info@ridevendor.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-white/70 text-sm">
                      Mon - Sat: 8:00 AM - 6:00 PM<br />
                      Sunday: By Appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-slate-100 rounded-[2rem] h-64 flex items-center justify-center">
              <p className="text-gray-400 font-medium">Map placeholder - Integration ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
