import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function Showcase() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className={`min-h-screen bg-background text-foreground p-8 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary">EZTravel Design System</h1>
            <p className="text-muted-foreground mt-2">Component Showcase & Typography V1.0</p>
          </div>
          <Button onClick={toggleTheme} variant="outline">
            Toggle {isDark ? 'Light' : 'Dark'} Mode
          </Button>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Typography (Playfair Display & Be Vietnam Pro)</h2>
          <div className="space-y-4">
            <h1 className="text-5xl font-serif">Heading 1 - Playfair Display</h1>
            <h2 className="text-4xl font-serif">Heading 2 - Playfair Display</h2>
            <h3 className="text-3xl font-serif">Heading 3 - Playfair Display</h3>
            <h4 className="text-2xl font-serif">Heading 4 - Playfair Display</h4>
            <h5 className="text-xl font-serif">Heading 5 - Playfair Display</h5>
            <p className="text-base font-sans">
              Body Text - Be Vietnam Pro. The quick brown fox jumps over the lazy dog. EZTravel is designed to make trip planning exciting, organized, and effortless.
            </p>
            <p className="text-sm font-sans text-muted-foreground">
              Small Text / Muted Foreground - Be Vietnam Pro.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Inputs & Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Standard Input</label>
              <Input placeholder="Enter destination..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Dropdown</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Textarea</label>
              <Textarea placeholder="Describe your trip..." rows={4} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Cards & Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif">Trip to Da Nang</CardTitle>
                    <CardDescription>3 days • 2 travelers</CardDescription>
                  </div>
                  <Badge variant="default">Upcoming</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Explore the beautiful beaches and enjoy the local cuisine in central Vietnam.</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Edit</Button>
                <Button>View Itinerary</Button>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="default">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Danger</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm cursor-help underline decoration-dashed">Hover me</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a tooltip component!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Tabs & Dialogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Tabs defaultValue="day1" className="w-full">
              <TabsList>
                <TabsTrigger value="day1">Day 1</TabsTrigger>
                <TabsTrigger value="day2">Day 2</TabsTrigger>
                <TabsTrigger value="day3">Day 3</TabsTrigger>
              </TabsList>
              <TabsContent value="day1" className="p-4 border border-border rounded-md mt-2">
                Content for Day 1
              </TabsContent>
              <TabsContent value="day2" className="p-4 border border-border rounded-md mt-2">
                Content for Day 2
              </TabsContent>
              <TabsContent value="day3" className="p-4 border border-border rounded-md mt-2">
                Content for Day 3
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-center border border-border rounded-md p-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-serif">Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this trip? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">UI Workflow States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Empty State */}
            <Card className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 border-dashed">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
              </div>
              <CardTitle className="mb-2">No itineraries yet</CardTitle>
              <CardDescription className="mb-6 max-w-sm">
                You haven't planned any trips. Create your first itinerary to start exploring the world.
              </CardDescription>
              <Button>Create Itinerary</Button>
            </Card>

            {/* Error State */}
            <Card className="border-destructive/50 bg-destructive/10">
              <CardHeader>
                <div className="flex items-center gap-2 text-destructive">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <CardTitle className="text-destructive font-serif">Failed to load destination</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive/80">
                  We couldn't connect to the server to fetch the latest travel data. Please check your internet connection and try again.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" size="sm">Retry Connection</Button>
              </CardFooter>
            </Card>

            {/* Success State */}
            <Card className="border-green-500/50 bg-green-500/10 dark:bg-green-500/20">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <CardTitle className="text-green-700 dark:text-green-400 font-serif">Payment Successful</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700/80 dark:text-green-400/80">
                  Your booking for the Da Nang homestay has been confirmed. A receipt has been sent to your email.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">View Receipt</Button>
              </CardFooter>
            </Card>

            {/* Loading State */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Skeleton className="h-10 w-28" />
              </CardFooter>
            </Card>

          </div>
        </section>
      </div>
    </div>
  )
}
