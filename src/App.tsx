/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { HowItWorks } from './components/HowItWorks';
import { WhoItIsFor } from './components/WhoItIsFor';
import { Benefits } from './components/Benefits';
import { EarlyAccessForm } from './components/EarlyAccessForm';
import { SurveySection } from './components/SurveySection';
import { FAQSection } from './components/FAQSection';
import { TestimonialPlaceholder } from './components/TestimonialPlaceholder';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminPortal } from './components/AdminPortal';
import { RoleType } from './types';
import { logSiteActivity } from './services/submissionsStore';

const isAdminUrl = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  return path === '/admin' || hash === '#/admin' || hash === '#admin' || params.has('admin');
};

export default function App() {
  const [selectedRole, setSelectedRole] = useState<RoleType>('Farmer');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => isAdminUrl());
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // Sync admin state with browser URL navigation (/admin)
  useEffect(() => {
    const syncRoute = () => {
      setIsAdminOpen(isAdminUrl());
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  // Log campaign visit once per browser session
  useEffect(() => {
    if (!isAdminOpen && !sessionStorage.getItem('farmlink_visit_logged')) {
      sessionStorage.setItem('farmlink_visit_logged', '1');
      logSiteActivity(
        'visit',
        'Campaign Page Visited',
        `Visitor opened ${window.location.pathname || '/'}`
      );
    }
  }, [isAdminOpen]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'survey') {
      setIsSurveyOpen(true);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectRoleFromAudience = (role: string) => {
    setSelectedRole(role as RoleType);
    logSiteActivity('role_interest', 'Audience Role Selected', `Visitor selected "${role}" to register`);
    scrollToSection('early-access');
  };

  const handleExitAdmin = () => {
    if (window.location.pathname !== '/' || window.location.hash || window.location.search) {
      window.history.pushState({}, '', '/');
    }
    setIsAdminOpen(false);
  };

  if (isAdminOpen) {
    return <AdminPortal onClose={handleExitAdmin} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF9ED] text-[#202522] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#092C24]">
      {/* Top Bar Navigation */}
      <Navbar onNavigateTo={scrollToSection} />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onJoinEarlyAccess={() => scrollToSection('early-access')} />

        {/* Short Trust Strip below Hero */}
        <TrustStrip />

        {/* Problem Section */}
        <ProblemSection />

        {/* Solution Section */}
        <SolutionSection onJoinEarlyAccess={() => scrollToSection('early-access')} />

        {/* How It Works Section */}
        <HowItWorks onJoinEarlyAccess={() => scrollToSection('early-access')} />

        {/* Who It Is For Section */}
        <WhoItIsFor onSelectRole={handleSelectRoleFromAudience} />

        {/* Benefits Section */}
        <Benefits onJoinEarlyAccess={() => scrollToSection('early-access')} />

        {/* Early Access Form Section */}
        <EarlyAccessForm initialRole={selectedRole} />

        {/* Survey Section */}
        <SurveySection
          isOpen={isSurveyOpen}
          onToggle={() => setIsSurveyOpen((prev) => !prev)}
        />

        {/* FAQ Section */}
        <FAQSection />

        {/* Clear Testimonials & Partners Placeholder */}
        <TestimonialPlaceholder onJoinEarlyAccess={() => scrollToSection('early-access')} />

        {/* Final CTA Section */}
        <FinalCTA onJoinEarlyAccess={() => scrollToSection('early-access')} />
      </main>

      {/* Footer */}
      <Footer onNavigateTo={scrollToSection} />

      {/* Quick Floating WhatsApp Action */}
      <WhatsAppFloatingButton />
    </div>
  );
}
