"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface CategoryVisibilityProps {
  categories?: Category[];
  onSaveComplete?: () => void;
}

export function CategoryVisibility({ categories = [], onSaveComplete }: CategoryVisibilityProps) {
  const [categoriesData, setCategoriesData] = useState<Category[]>(categories);
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>(
    categories.reduce((acc, category) => {
      acc[category.id] = true; // All categories visible by default
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch categories if not provided
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { getSeats } = await import('../actions/seats');
        const seats = await getSeats();

        // Extract categories from seats
        const categoriesFromSeats = seats.reduce((acc: Record<string, Category>, seat) => {
          if (!acc[seat.category]) {
            // Generate a color based on category name
            const hue = seat.category.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 360;
            acc[seat.category] = {
              id: seat.category,
              name: seat.category,
              color: `hsl(${hue}, 70%, 50%)`,
              count: 0
            };
          }
          acc[seat.category]!.count++;
          return acc;
        }, {});

        setCategoriesData(Object.values(categoriesFromSeats));
      } catch (error: any) {
        console.error('Failed to load categories:', error);
        setCategoriesData([]);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length === 0) {
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, [categories.length]);

  // Load existing settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { getCategorySettings } = await import('../actions/venue-category-settings');
        const settings = await getCategorySettings();

        // Merge with default settings (all visible)
        const mergedSettings = categoriesData.reduce((acc, category) => {
          acc[category.id] = settings[category.id] !== undefined ? settings[category.id] : true;
          return acc;
        }, {} as Record<string, boolean>);

        setVisibleCategories(mergedSettings);
      } catch (error: any) {
        console.error('Failed to load category settings:', error);
      }
    };

    if (categoriesData.length > 0) {
      fetchSettings();
    }
  }, [categoriesData]);

  const handleToggle = (categoryId: string) => {
    const newVisibleCategories = {
      ...visibleCategories,
      [categoryId]: !visibleCategories[categoryId]
    };
    setVisibleCategories(newVisibleCategories);
    setHasChanges(true);
  };

  const toggleAll = (show: boolean) => {
    const newVisibleCategories = categoriesData.reduce((acc, category) => {
      acc[category.id] = show;
      return acc;
    }, {} as Record<string, boolean>);

    setVisibleCategories(newVisibleCategories);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { saveCategorySettings } = await import('../actions/venue-category-settings');
      await saveCategorySettings(visibleCategories);
      toast.success("Category visibility settings saved successfully!");
      setHasChanges(false);
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error: any) {
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Don't render anything if loading or no data
  if (loading || categoriesData.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
      <CardHeader className="relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Category Visibility</CardTitle>
              <CardDescription className="mt-1">
                Control which ticket categories are visible to customers
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => toggleAll(true)}
              size="sm"
              variant="outline"
              className="text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              Show All
            </Button>
            <Button
              onClick={() => toggleAll(false)}
              size="sm"
              variant="outline"
              className="text-xs border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-800"
            >
              Hide All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-5 h-5 rounded-md shadow-sm border border-border/50"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
                {category.count !== undefined && (
                  <Badge variant="outline" className="ml-2 bg-background/50">
                    {category.count} seats
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {visibleCategories[category.id] ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <Switch
                  checked={visibleCategories[category.id]}
                  onCheckedChange={() => handleToggle(category.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
