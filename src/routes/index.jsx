import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guards
import { ProtectedRoute, AdminRoute, GuestRoute } from './guards';

// Loading Component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
  </div>
);

// Lazy Loaded Pages
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Services = lazy(() => import('../pages/Services'));
const Contact = lazy(() => import('../pages/Contact'));
const Shop = lazy(() => import('../pages/Shop'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const CarSales = lazy(() => import('../pages/CarSales'));
const CarRentals = lazy(() => import('../pages/CarRentals'));
const CarsList = lazy(() => import('../pages/CarsList'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

const CarDetails = lazy(() => import('../pages/CarDetails'));
const CarRentalDetails = lazy(() => import('../pages/CarRentalDetails'));
const CarHireListing = lazy(() => import('../pages/CarHireListing'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const MyBookings = lazy(() => import('../pages/dashboard/MyBookings'));
const MyOrders = lazy(() => import('../pages/dashboard/MyOrders'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const SavedVehicles = lazy(() => import('../pages/dashboard/SavedVehicles'));
const Listings = lazy(() => import('../pages/dashboard/Listings'));
const BookRental = lazy(() => import('../pages/dashboard/BookRental'));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess'));
const AdminCars = lazy(() => import('../pages/admin/AdminCars'));
const AdminServices = lazy(() => import('../pages/admin/AdminServices'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminCmsPages = lazy(() => import('../pages/admin/AdminCmsPages'));
const AdminContactSubmissions = lazy(() => import('../pages/admin/AdminContactSubmissions'));
const AdminGlobalSeoSettings = lazy(() => import('../pages/admin/AdminGlobalSeoSettings'));


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoading />}><Home /></Suspense> },
      { path: 'about', element: <Suspense fallback={<PageLoading />}><About /></Suspense> },
      { path: 'services', element: <Suspense fallback={<PageLoading />}><Services /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<PageLoading />}><Contact /></Suspense> },
      { path: 'shop', element: <Suspense fallback={<PageLoading />}><Shop /></Suspense> },
      { path: 'car-sales', element: <Suspense fallback={<PageLoading />}><CarSales /></Suspense> },
      { path: 'car-hire', element: <Suspense fallback={<PageLoading />}><CarRentals /></Suspense> },
      { path: 'cars', element: <Suspense fallback={<PageLoading />}><CarsList /></Suspense> },
      { path: 'cars/:carId', element: <Suspense fallback={<PageLoading />}><CarDetails /></Suspense> },
      { path: 'car-hire/:carId', element: <Suspense fallback={<PageLoading />}><CarRentalDetails /></Suspense> },
      { path: 'car-hire/all', element: <Suspense fallback={<PageLoading />}><CarHireListing /></Suspense> },
      { path: 'payment-success', element: <Suspense fallback={<PageLoading />}><PaymentSuccess /></Suspense> },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Suspense fallback={<PageLoading />}><Login /></Suspense> },
          { path: 'register', element: <Suspense fallback={<PageLoading />}><Register /></Suspense> },
          { path: 'forgot-password', element: <Suspense fallback={<PageLoading />}><ForgotPassword /></Suspense> },
          { path: 'reset-password/:token', element: <Suspense fallback={<PageLoading />}><ResetPassword /></Suspense> },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoading />}><DashboardHome /></Suspense> },
          { path: 'bookings', element: <Suspense fallback={<PageLoading />}><MyBookings /></Suspense> },
          { path: 'book-rental', element: <Suspense fallback={<PageLoading />}><BookRental /></Suspense> },
          { path: 'orders', element: <Suspense fallback={<PageLoading />}><MyOrders /></Suspense> },
          { path: 'profile', element: <Suspense fallback={<PageLoading />}><Profile /></Suspense> },
          { path: 'saved', element: <Suspense fallback={<PageLoading />}><SavedVehicles /></Suspense> },
          { path: 'listings', element: <Suspense fallback={<PageLoading />}><Listings /></Suspense> },
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoading />}><AdminDashboard /></Suspense> },
          { path: 'cars', element: <Suspense fallback={<PageLoading />}><AdminCars /></Suspense> },
          { path: 'services', element: <Suspense fallback={<PageLoading />}><AdminServices /></Suspense> },
          { path: 'seo-settings', element: <Suspense fallback={<PageLoading />}><AdminGlobalSeoSettings /></Suspense> },
          { path: 'pages', element: <Suspense fallback={<PageLoading />}><AdminCmsPages /></Suspense> },
          { path: 'contact', element: <Suspense fallback={<PageLoading />}><AdminContactSubmissions /></Suspense> },
          { path: 'users', element: <Suspense fallback={<PageLoading />}><AdminUsers /></Suspense> },
          { path: 'bookings', element: <Suspense fallback={<PageLoading />}><AdminBookings /></Suspense> },
          { path: 'orders', element: <Suspense fallback={<PageLoading />}><AdminOrders /></Suspense> },
        ]
      }
    ]
  },
  { path: '/unauthorized', element: <Suspense fallback={<PageLoading />}><Unauthorized /></Suspense> },
  { path: '*', element: <Suspense fallback={<PageLoading />}><NotFound /></Suspense> },
]);
