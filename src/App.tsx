import React, { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Award, CheckCircle, Play, User, BarChart3 } from '@phosphor-icons/react';

// Sample course data
const sampleCourses = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
    duration: '8 hours',
    difficulty: 'Beginner',
    modules: [
      { id: 1, title: 'HTML Basics', duration: '2 hours', completed: false },
      { id: 2, title: 'CSS Styling', duration: '3 hours', completed: false },
      { id: 3, title: 'JavaScript Fundamentals', duration: '3 hours', completed: false }
    ],
    enrolled: false,
    progress: 0
  },
  {
    id: 2,
    title: 'React Development',
    description: 'Build modern web applications with React',
    duration: '12 hours',
    difficulty: 'Intermediate',
    modules: [
      { id: 4, title: 'React Components', duration: '4 hours', completed: false },
      { id: 5, title: 'State Management', duration: '4 hours', completed: false },
      { id: 6, title: 'React Hooks', duration: '4 hours', completed: false }
    ],
    enrolled: false,
    progress: 0
  },
  {
    id: 3,
    title: 'Data Analysis with Python',
    description: 'Analyze data using Python libraries like pandas and matplotlib',
    duration: '10 hours',
    difficulty: 'Intermediate',
    modules: [
      { id: 7, title: 'Python Basics', duration: '3 hours', completed: false },
      { id: 8, title: 'Data Manipulation', duration: '4 hours', completed: false },
      { id: 9, title: 'Data Visualization', duration: '3 hours', completed: false }
    ],
    enrolled: false,
    progress: 0
  }
];

function App() {
  const [courses, setCourses] = useKV('learning-courses', sampleCourses);
  const [enrolledCourses, setEnrolledCourses] = useKV('enrolled-courses', []);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const enrollInCourse = (courseId) => {
    setCourses(currentCourses => 
      currentCourses.map(course => 
        course.id === courseId ? { ...course, enrolled: true } : course
      )
    );
    
    const course = courses.find(c => c.id === courseId);
    if (course && !enrolledCourses.find(c => c.id === courseId)) {
      setEnrolledCourses(current => [...current, { ...course, enrolled: true }]);
    }
  };

  const completeModule = (courseId, moduleId) => {
    setCourses(currentCourses =>
      currentCourses.map(course => {
        if (course.id === courseId) {
          const updatedModules = course.modules.map(module =>
            module.id === moduleId ? { ...module, completed: true } : module
          );
          const completedCount = updatedModules.filter(m => m.completed).length;
          const progress = (completedCount / updatedModules.length) * 100;
          
          return { ...course, modules: updatedModules, progress };
        }
        return course;
      })
    );

    // Update enrolled courses as well
    setEnrolledCourses(current =>
      current.map(course => {
        if (course.id === courseId) {
          const updatedModules = course.modules.map(module =>
            module.id === moduleId ? { ...module, completed: true } : module
          );
          const completedCount = updatedModules.filter(m => m.completed).length;
          const progress = (completedCount / updatedModules.length) * 100;
          
          return { ...course, modules: updatedModules, progress };
        }
        return course;
      })
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEnrolled = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  const averageProgress = enrolledCourses.length > 0 
    ? enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Learning Platform</h1>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Welcome back!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">Course Library</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEnrolled}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedCourses}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {enrolledCourses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No courses enrolled yet. Browse the course library to get started!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {enrolledCourses.slice(0, 4).map(course => (
                    <Card key={course.id} className="course-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                          </div>
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {course.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} className="progress-bar" />
                        </div>
                        <Button 
                          onClick={() => setSelectedCourse(course)}
                          className="w-full mt-4"
                          variant={course.progress === 100 ? "secondary" : "default"}
                        >
                          {course.progress === 100 ? "Review" : "Continue"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Course Library Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map(course => (
                  <Card key={course.id} className="course-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription className="mt-2">{course.description}</CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.modules.length} modules</span>
                        </div>
                      </div>
                      
                      {course.enrolled ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} className="progress-bar" />
                          <Button 
                            onClick={() => setSelectedCourse(course)}
                            className="w-full mt-2"
                            variant={course.progress === 100 ? "secondary" : "default"}
                          >
                            {course.progress === 100 ? "Review" : "Continue"}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => enrollInCourse(course.id)}
                          className="w-full"
                        >
                          Enroll Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">My Learning Progress</h2>
              {enrolledCourses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No progress to show yet. Enroll in a course to track your learning journey!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map(course => (
                    <Card key={course.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>
                              {course.modules.filter(m => m.completed).length} of {course.modules.length} modules completed
                            </CardDescription>
                          </div>
                          {course.progress === 100 && (
                            <Badge variant="secondary" className="bg-accent text-accent-foreground">
                              <Award className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span>{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} className="progress-bar" />
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Modules:</h4>
                          {course.modules.map(module => (
                            <div key={module.id} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex items-center space-x-2">
                                {module.completed ? (
                                  <CheckCircle className="h-4 w-4 text-accent" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                                )}
                                <span className="text-sm">{module.title}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{module.duration}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedCourse.title}</CardTitle>
                  <CardDescription className="mt-2">{selectedCourse.description}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCourse(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                    {selectedCourse.difficulty}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Progress</span>
                    <span>{Math.round(selectedCourse.progress)}%</span>
                  </div>
                  <Progress value={selectedCourse.progress} className="progress-bar" />
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Course Modules:</h4>
                  <div className="space-y-2">
                    {selectedCourse.modules.map(module => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div className="flex items-center space-x-3">
                          {module.completed ? (
                            <CheckCircle className="h-5 w-5 text-accent" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                          )}
                          <div>
                            <span className="font-medium">{module.title}</span>
                            <div className="text-xs text-muted-foreground">{module.duration}</div>
                          </div>
                        </div>
                        {!module.completed && (
                          <Button 
                            size="sm"
                            onClick={() => completeModule(selectedCourse.id, module.id)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;