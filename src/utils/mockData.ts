// mockData.ts
// This file contains mock data to use when the API is unavailable

import type { User } from "../contexts/AuthContext";

// Mock user data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyen Van A",
    email: "admin@englishhub.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Nguyen Van B",
    email: "user@englishhub.com",
    role: "user",
  },
];

// Mock courses data
export interface Course {
  id: string;
  title: string;
  level: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  imageUrl: string;
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Basic English Grammar",
    level: "Beginner",
    progress: 75,
    totalLessons: 20,
    completedLessons: 15,
    imageUrl: "/images/courses/grammar.jpg",
  },
  {
    id: "2",
    title: "Business English",
    level: "Intermediate",
    progress: 40,
    totalLessons: 15,
    completedLessons: 6,
    imageUrl: "/images/courses/business.jpg",
  },
  {
    id: "3",
    title: "Advanced Conversation",
    level: "Advanced",
    progress: 20,
    totalLessons: 12,
    completedLessons: 2,
    imageUrl: "/images/courses/conversation.jpg",
  },
  {
    id: "4",
    title: "IELTS Preparation",
    level: "Advanced",
    progress: 0,
    totalLessons: 25,
    completedLessons: 0,
    imageUrl: "/images/courses/ielts.jpg",
  },
];

// Mock payment packages
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  recommended: boolean;
}

export const mockPackages: Package[] = [
  {
    id: "1",
    name: "Basic",
    description: "Perfect for beginners",
    price: 399000,
    currency: "VND",
    duration: "1 month",
    features: ["Access to basic courses", "24/7 support", "Mobile app access"],
    recommended: false,
  },
  {
    id: "2",
    name: "Standard",
    description: "Most popular choice",
    price: 999000,
    currency: "VND",
    duration: "3 months",
    features: [
      "All basic features",
      "Certificate on completion",
      "Weekly practice sessions",
      "Progress reports",
    ],
    recommended: true,
  },
  {
    id: "3",
    name: "Premium",
    description: "For serious learners",
    price: 1799000,
    currency: "VND",
    duration: "6 months",
    features: [
      "All standard features",
      "Personal tutor",
      "Unlimited speaking practice",
      "Custom learning path",
      "Guaranteed results",
    ],
    recommended: false,
  },
];

// Mock admin statistics
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  courseCompletionRate: number;
}

export const mockAdminStats: AdminStats = {
  totalUsers: 256,
  activeUsers: 187,
  totalCourses: 12,
  totalRevenue: 45600000, // in VND
  newUsersThisMonth: 24,
  courseCompletionRate: 68, // percentage
};

// Helper function to simulate API delay
export const simulateApiDelay = (
  min: number = 300,
  max: number = 800
): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((resolve) => setTimeout(resolve, delay));
};
