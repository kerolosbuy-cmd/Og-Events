import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { updateSettings, goToDashboard, logout } from './actions';
import { updatePaymentInstructions } from './update-payment-instructions';
import PaymentMethodsEditor from './payment-methods-editor';
import PaymentModeForm from './payment-mode-form';
import fs from 'fs';
import { isUserAdmin } from '@/lib/auth';
import path from 'path';
import settingsData from '@/config/settings.json';
import { Settings, DollarSign, Mail, Shield, CheckCircle, ChevronLeft, LogOut, CreditCard } from 'lucide-react';

export default async function SettingsContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // Check if the user is an authorized admin
  if (!isUserAdmin(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You are not authorized to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <form action={goToDashboard}>
              <Button type="submit" variant="outline">
                Back to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Hero Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-xl shadow-lg">
              <Settings className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-muted-foreground text-base ml-[60px]">
            Manage your application configuration and preferences
          </p>
        </header>

        {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get(
          'success'
        ) && (
            <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-green-800 font-medium">Settings updated successfully!</p>
              </div>
            </div>
          )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* General Settings */}
          <Card className="shadow-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                General Settings
              </CardTitle>
              <CardDescription>Configure general application settings</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form action={updateSettings} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name" className="text-sm font-medium">Site Name</Label>
                  <Input
                    id="site-name"
                    name="site-name"
                    defaultValue="OG Event"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description" className="text-sm font-medium">Site Description</Label>
                  <Input
                    id="site-description"
                    name="site-description"
                    defaultValue="Event Management Platform"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="shadow-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                Payment Settings
              </CardTitle>
              <CardDescription>Configure payment processing options</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <PaymentModeForm />
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="shadow-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                Email Settings
              </CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form action={updateSettings} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-sm font-medium">Admin Email</Label>
                  <Input
                    id="admin-email"
                    name="admin-email"
                    type="email"
                    defaultValue={user.email || ''}
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-email" className="text-sm font-medium">Notification Email</Label>
                  <Input
                    id="notification-email"
                    name="notification-email"
                    type="email"
                    defaultValue="notifications@example.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                Security Settings
              </CardTitle>
              <CardDescription>Manage security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form action={updateSettings} className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="two-factor" name="two-factor" className="w-4 h-4 rounded border-gray-300" />
                    <Label htmlFor="two-factor" className="font-medium cursor-pointer">Enable Two-Factor Authentication</Label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="session-timeout"
                      name="session-timeout"
                      defaultChecked
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <Label htmlFor="session-timeout" className="font-medium cursor-pointer">Enable Session Timeout</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  Update Security Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Payment Instructions (if manual mode) */}
        {settingsData.payment.mode === "manual" && (
          <div className="mb-8">
            <Card className="shadow-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  Payment Instructions
                </CardTitle>
                <CardDescription>Configure manual payment instructions for customers</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodsEditor
                  initialTitle={settingsData.payment.instructions.title}
                  initialPaymentMethods={settingsData.payment.instructions.paymentMethods}
                  onSave={updatePaymentInstructions}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <form action={goToDashboard} className="flex-1 sm:flex-initial">
            <Button type="submit" variant="outline" className="w-full sm:w-auto border-border/50 hover:bg-muted/50 transition-all duration-200">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </form>
          <form action={logout} className="flex-1 sm:flex-initial">
            <Button type="submit" variant="outline" className="w-full sm:w-auto text-destructive border-destructive/20 hover:bg-destructive/10 transition-all duration-200">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
