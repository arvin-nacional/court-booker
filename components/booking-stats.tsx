"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Function to generate mock data based on the number of courts
function generateCourtData(totalCourts: number) {
  return Array.from({ length: totalCourts }, (_, i) => ({
    name: `Court ${i + 1}`,
    bookings: Math.floor(Math.random() * 20) + 30, // Random number between 30-50
  }))
}

// Mock data for booking statistics
const weeklyData = [
  { name: "Mon", bookings: 4 },
  { name: "Tue", bookings: 3 },
  { name: "Wed", bookings: 5 },
  { name: "Thu", bookings: 7 },
  { name: "Fri", bookings: 8 },
  { name: "Sat", bookings: 12 },
  { name: "Sun", bookings: 10 },
]

const monthlyData = [
  { name: "Week 1", bookings: 24 },
  { name: "Week 2", bookings: 28 },
  { name: "Week 3", bookings: 32 },
  { name: "Week 4", bookings: 36 },
]

interface BookingStatsProps {
  totalCourts?: number
}

export function BookingStats({ totalCourts = 4 }: BookingStatsProps) {
  const [courtData, setCourtData] = useState<{ name: string; bookings: number }[]>([])

  useEffect(() => {
    setCourtData(generateCourtData(totalCourts))
  }, [totalCourts])

  // Find the most and least booked courts
  const mostBookedCourt = [...courtData].sort((a, b) => b.bookings - a.bookings)[0]
  const leastBookedCourt = [...courtData].sort((a, b) => a.bookings - b.bookings)[0]

  return (
    <Tabs defaultValue="weekly" className="space-y-4">
      <TabsList>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="courts">By Court</TabsTrigger>
      </TabsList>
      <TabsContent value="weekly" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">49</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Saturday</div>
              <p className="text-xs text-muted-foreground">12 bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Popular Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18:00</div>
              <p className="text-xs text-muted-foreground">8 bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$735</div>
              <p className="text-xs text-muted-foreground">+8% from last week</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Booking Overview</CardTitle>
            <CardDescription>Number of court bookings per day this week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="monthly" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Booking Overview</CardTitle>
            <CardDescription>Number of court bookings per week this month</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="courts" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Booked Court</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mostBookedCourt?.name || "N/A"}</div>
              <p className="text-xs text-muted-foreground">{mostBookedCourt?.bookings || 0} bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Least Booked Court</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leastBookedCourt?.name || "N/A"}</div>
              <p className="text-xs text-muted-foreground">{leastBookedCourt?.bookings || 0} bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courtData.length > 0
                  ? Math.round(courtData.reduce((sum, court) => sum + court.bookings, 0) / courtData.length)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Per court</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Court</CardTitle>
            <CardDescription>Number of bookings per court this month</CardDescription>
          </CardHeader>
          <CardContent>
            {totalCourts > 10 ? (
              <ScrollArea className="h-80 w-full">
                <div className="pr-4">
                  <ResponsiveContainer width="100%" height={totalCourts * 40}>
                    <BarChart data={courtData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={60} />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ScrollArea>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={courtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

