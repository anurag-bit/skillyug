'use client'

import React from 'react';
import { useAuth } from "../../hooks/AuthContext";
import { LogOut, Users, BookOpen, MessageSquare, Calendar } from 'lucide-react';
import Image from 'next/image';

// ## Sidebar Component Definition ##
const Sidebar = () => {
  const { signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
  };

  return (
    <aside className="w-64 bg-blue-900/50 p-6 flex flex-col flex-shrink-0">
      <div className="mb-8">
        <Image
          src="/logo/Logo.png"
          alt="Skill Yug Logo"
          width={48}
          height={48}
          className="h-12 w-auto bg-white p-2 rounded-lg"
        />
      </div>
      <nav className="flex flex-col space-y-3 flex-grow">
        <button className="w-full text-left p-3 bg-orange-500 rounded-lg font-semibold">Dashboard</button>
        <button className="w-full text-left p-3 hover:bg-blue-800 rounded-lg">My Students</button>
        <button className="w-full text-left p-3 hover:bg-blue-800 rounded-lg">My Courses</button>
        <button className="w-full text-left p-3 hover:bg-blue-800 rounded-lg">Schedule</button>
        <button className="w-full text-left p-3 hover:bg-blue-800 rounded-lg">Messages</button>
      </nav>
      <div>
        <button 
          onClick={handleLogout}
          className="w-full text-left p-3 border border-blue-700 hover:bg-blue-800 rounded-lg flex items-center space-x-2"
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

// ## Main Content Component Definition ##
const MainContent = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Mentor Dashboard</h1>
        
        {/* Welcome Message */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome, {user?.name || user?.email || 'Mentor'}!
          </h2>
          <p className="text-gray-300">
            Guide your students and manage your courses from this dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6">
            <Users className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">My Students</h3>
            <p className="text-2xl font-bold text-orange-500">45</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6">
            <BookOpen className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">My Courses</h3>
            <p className="text-2xl font-bold text-orange-500">8</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6">
            <Calendar className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">Sessions Today</h3>
            <p className="text-2xl font-bold text-orange-500">3</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6">
            <MessageSquare className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">Messages</h3>
            <p className="text-2xl font-bold text-orange-500">12</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6 hover:bg-black/40 transition-all duration-300">
            <Users className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">My Students</h3>
            <p className="text-gray-300 mb-4">View and manage your student progress</p>
            <button className="text-orange-500 hover:text-orange-400 font-medium">
              View Students →
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6 hover:bg-black/40 transition-all duration-300">
            <BookOpen className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Course Content</h3>
            <p className="text-gray-300 mb-4">Create and manage your course materials</p>
            <button className="text-orange-500 hover:text-orange-400 font-medium">
              Manage Content →
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-blue-800/30 rounded-xl p-6 hover:bg-black/40 transition-all duration-300">
            <Calendar className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Schedule</h3>
            <p className="text-gray-300 mb-4">Manage your teaching schedule</p>
            <button className="text-orange-500 hover:text-orange-400 font-medium">
              View Schedule →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ## Main MentorsDashboard Component ##
const MentorsDashboard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-blue-900 to-blue-800">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default MentorsDashboard;