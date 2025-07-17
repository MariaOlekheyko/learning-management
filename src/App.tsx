import React, { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clock, Award, CheckCircle, Play, User, BarChart3, LinkSimple, MicrosoftOutlookLogo, GithubLogo, LinkedinLogo, Check, X, ChatCircle, Robot, PaperPlaneRight, ArrowUp, Sparkle } from '@phosphor-icons/react';

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
  const [connectedAccounts, setConnectedAccounts] = useKV('connected-accounts', {
    microsoft: null,
    github: null,
    linkedin: null
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSellerAgent, setShowSellerAgent] = useState(false);
  const [agentMessages, setAgentMessages] = useKV('agent-messages', []);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [hasInitialGreeting, setHasInitialGreeting] = useKV('agent-initial-greeting', false);

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

  // Account linking functions
  const connectAccount = (platform, userData) => {
    setConnectedAccounts(current => ({
      ...current,
      [platform]: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        connectedAt: new Date().toISOString(),
        // Simulate additional data that would come from each platform
        platformData: userData.platformData || {}
      }
    }));
  };

  const disconnectAccount = (platform) => {
    setConnectedAccounts(current => ({
      ...current,
      [platform]: null
    }));
  };

  // Mock authentication functions (in real implementation, these would use OAuth)
  const authenticateAccount = async (platform) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data for different platforms
    const mockUserData = {
      microsoft: {
        id: 'ms_user_123',
        name: 'John Doe',
        email: 'john.doe@company.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft`,
        platformData: {
          organization: 'Microsoft Corporation',
          jobTitle: 'Software Engineer',
          skills: ['C#', 'Azure', 'TypeScript']
        }
      },
      github: {
        id: 'gh_user_456',
        name: 'John Doe',
        email: 'john.doe@github.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=github`,
        platformData: {
          username: 'johndoe',
          publicRepos: 42,
          followers: 156,
          languages: ['JavaScript', 'Python', 'Go']
        }
      },
      linkedin: {
        id: 'li_user_789',
        name: 'John Doe',
        email: 'john.doe@linkedin.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=linkedin`,
        platformData: {
          headline: 'Senior Software Engineer',
          connections: 500,
          industry: 'Technology',
          skills: ['React', 'Node.js', 'AWS']
        }
      }
    };

    connectAccount(platform, mockUserData[platform]);
  };

  const getAccountIcon = (platform) => {
    switch (platform) {
      case 'microsoft': return <MicrosoftOutlookLogo className="h-5 w-5" />;
      case 'github': return <GithubLogo className="h-5 w-5" />;
      case 'linkedin': return <LinkedinLogo className="h-5 w-5" />;
      default: return <LinkSimple className="h-5 w-5" />;
    }
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case 'microsoft': return 'Microsoft';
      case 'github': return 'GitHub';
      case 'linkedin': return 'LinkedIn';
      default: return platform;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'microsoft': return 'text-blue-600';
      case 'github': return 'text-gray-800';
      case 'linkedin': return 'text-blue-700';
      default: return 'text-gray-600';
    }
  };

  // Seller Agent Functions
  const sendMessageToAgent = async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setAgentMessages(currentMessages => [...currentMessages, userMessage]);
    setCurrentMessage('');
    setIsAgentTyping(true);

    // Simulate agent processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate agent response based on user context
    const unifiedProfile = getUnifiedProfile();
    const userContext = {
      enrolledCourses: enrolledCourses.length,
      completedCourses: enrolledCourses.filter(c => c.progress === 100).length,
      averageProgress: enrolledCourses.length > 0 ? enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length : 0,
      connectedAccounts: Object.values(connectedAccounts).filter(Boolean).length,
      skills: unifiedProfile?.skills || [],
      availableCourses: courses.filter(c => !c.enrolled).length,
      userName: unifiedProfile?.name || 'there'
    };

    const prompt = spark.llmPrompt`You are a helpful learning platform sales agent and advisor. Based on the user's message: "${message}" and their profile context: ${JSON.stringify(userContext)}, provide a personalized, helpful response that:

1. Addresses their specific question or need directly
2. Suggests specific courses from the available catalog when appropriate
3. Provides actionable learning guidance and motivation
4. Keeps responses concise and friendly (2-3 sentences max)
5. Uses a warm, encouraging tone
6. If they ask about course recommendations, be specific about which courses match their skill level

Available courses: ${JSON.stringify(courses.map(c => ({ title: c.title, description: c.description, difficulty: c.difficulty, duration: c.duration, enrolled: c.enrolled })))}

Focus on being helpful, personalized, and encouraging based on their current progress and connected skills.`;

    try {
      const agentResponse = await spark.llm(prompt);
      
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: agentResponse,
        timestamp: new Date().toISOString()
      };

      setAgentMessages(currentMessages => [...currentMessages, agentMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: "I'm having trouble connecting right now. Please try again in a moment, or browse our course catalog to find something that interests you!",
        timestamp: new Date().toISOString()
      };
      setAgentMessages(currentMessages => [...currentMessages, errorMessage]);
    }

    setIsAgentTyping(false);
  };

  const clearAgentChat = () => {
    setAgentMessages([]);
    setHasInitialGreeting(false);
  };

  const initializeAgent = async () => {
    if (hasInitialGreeting) return;
    
    setIsAgentTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const unifiedProfile = getUnifiedProfile();
    const userName = unifiedProfile?.name || 'there';
    
    const welcomeMessage = {
      id: Date.now(),
      type: 'agent',
      content: `Hi ${userName}! 👋 I'm your Learning Assistant. I'm here to help you discover the perfect courses based on your skills and goals. How can I assist you today?`,
      timestamp: new Date().toISOString()
    };
    
    setAgentMessages(currentMessages => [...currentMessages, welcomeMessage]);
    setHasInitialGreeting(true);
    setIsAgentTyping(false);
  };

  const getRecommendedCourses = () => {
    const unifiedProfile = getUnifiedProfile();
    const userSkills = unifiedProfile?.skills || [];
    
    // Simple recommendation logic based on skills and progress
    return courses.filter(course => {
      if (course.enrolled) return false;
      
      // Recommend based on skill match
      const hasRelatedSkills = userSkills.some(skill => 
        course.title.toLowerCase().includes(skill.toLowerCase()) ||
        course.description.toLowerCase().includes(skill.toLowerCase())
      );
      
      return hasRelatedSkills;
    }).slice(0, 3);
  };

  const getUnifiedProfile = () => {
    const connectedPlatforms = Object.values(connectedAccounts).filter(Boolean);
    if (connectedPlatforms.length === 0) return null;

    // Combine skills from all platforms
    const allSkills = new Set();
    connectedPlatforms.forEach(account => {
      const skills = account.platformData?.skills || account.platformData?.languages || [];
      skills.forEach(skill => allSkills.add(skill));
    });

    // Get primary account (first connected one)
    const primaryAccount = connectedPlatforms[0];

    return {
      name: primaryAccount.name,
      email: primaryAccount.email,
      avatar: primaryAccount.avatar,
      skills: Array.from(allSkills),
      connectedPlatforms: connectedPlatforms.length,
      lastActive: new Date().toISOString()
    };
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
  
  const unifiedProfile = getUnifiedProfile();
  const connectedCount = Object.values(connectedAccounts).filter(Boolean).length;

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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSellerAgent(true)}
                className="flex items-center space-x-1"
              >
                <ChatCircle className="h-4 w-4" />
                <span>AI Assistant</span>
              </Button>
              {unifiedProfile ? (
                <div className="flex items-center space-x-3">
                  <img 
                    src={unifiedProfile.avatar} 
                    alt={unifiedProfile.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{unifiedProfile.name}</span>
                    <span className="text-xs text-muted-foreground">{connectedCount} account{connectedCount !== 1 ? 's' : ''} linked</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAccountModal(true)}
                  >
                    <LinkSimple className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Welcome!</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAccountModal(true)}
                      className="mt-1"
                    >
                      <LinkSimple className="h-4 w-4 mr-1" />
                      Link Accounts
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">Course Library</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Unified Learning Profile</h2>
              
              {unifiedProfile ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Profile Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Profile Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={unifiedProfile.avatar} 
                          alt={unifiedProfile.name}
                          className="h-12 w-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{unifiedProfile.name}</h3>
                          <p className="text-sm text-muted-foreground">{unifiedProfile.email}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">Skills from Connected Accounts</h4>
                        <div className="flex flex-wrap gap-2">
                          {unifiedProfile.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Connected Platforms</span>
                        <span>{unifiedProfile.connectedPlatforms}/3</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connected Accounts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <LinkSimple className="h-5 w-5" />
                        <span>Connected Accounts</span>
                      </CardTitle>
                      <CardDescription>
                        Link your accounts to create a unified learning profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(connectedAccounts).map(([platform, account]) => (
                        <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={getPlatformColor(platform)}>
                              {getAccountIcon(platform)}
                            </div>
                            <div>
                              <div className="font-medium">{getPlatformName(platform)}</div>
                              {account ? (
                                <div className="text-sm text-muted-foreground">
                                  {account.email}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  Not connected
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {account ? (
                              <>
                                <Check className="h-4 w-4 text-accent" />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => disconnectAccount(platform)}
                                >
                                  Disconnect
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => authenticateAccount(platform)}
                              >
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <LinkSimple className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create Your Unified Profile</h3>
                      <p className="text-muted-foreground mb-6">
                        Connect your Microsoft, GitHub, and LinkedIn accounts to create a comprehensive learning profile
                      </p>
                      <Button onClick={() => setShowAccountModal(true)}>
                        <LinkSimple className="h-4 w-4 mr-2" />
                        Link Your First Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Management Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Connect your accounts to create a unified learning profile
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAccountModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <LinkSimple className="h-4 w-4" />
                <AlertDescription>
                  Linking accounts allows us to aggregate your skills, projects, and professional information 
                  to provide personalized course recommendations.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h4 className="font-medium">Available Platforms</h4>
                {Object.entries(connectedAccounts).map(([platform, account]) => (
                  <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`${getPlatformColor(platform)} bg-gray-50 p-2 rounded`}>
                        {getAccountIcon(platform)}
                      </div>
                      <div>
                        <div className="font-medium">{getPlatformName(platform)}</div>
                        {account ? (
                          <div className="text-sm text-muted-foreground">
                            Connected as {account.name} ({account.email})
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Connect to sync your profile and skills
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {account ? (
                        <>
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            <Check className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectAccount(platform)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => authenticateAccount(platform)}
                          disabled={false}
                        >
                          Connect {getPlatformName(platform)}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {unifiedProfile && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Your Unified Profile</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span> {unifiedProfile.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span> {unifiedProfile.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Skills:</span> {unifiedProfile.skills.join(', ')}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Connected Platforms:</span> {unifiedProfile.connectedPlatforms}/3
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

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

      {/* Floating AI Assistant Button */}
      {!showSellerAgent && (
        <Button
          onClick={() => setShowSellerAgent(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
          size="sm"
        >
          <div className="relative">
            <ChatCircle className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></div>
          </div>
        </Button>
      )}

      {/* Seller Agent Chat Modal */}
      {showSellerAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <Robot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Learning Assistant</span>
                      <Sparkle className="h-4 w-4 text-accent" />
                    </CardTitle>
                    <CardDescription>
                      Your personalized learning guide and course advisor
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearAgentChat}
                    title="Clear chat"
                  >
                    Clear
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSellerAgent(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
                {agentMessages.length === 0 && !isAgentTyping ? (
                  <div className="text-center py-8">
                    <div className="bg-primary text-primary-foreground p-3 rounded-full w-fit mx-auto mb-4">
                      <Robot className="h-8 w-8" />
                    </div>
                    <h3 className="font-medium mb-2">Meet your Learning Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      I can help you discover courses, track your progress, and provide personalized learning recommendations.
                    </p>
                    <Button 
                      onClick={initializeAgent}
                      className="mb-4"
                    >
                      Start Conversation
                    </Button>
                    <div className="grid gap-2 max-w-md mx-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => sendMessageToAgent("What courses would you recommend for me?")}
                        className="text-left justify-start"
                      >
                        "What courses would you recommend for me?"
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => sendMessageToAgent("How can I track my learning progress?")}
                        className="text-left justify-start"
                      >
                        "How can I track my learning progress?"
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => sendMessageToAgent("What's the best way to get started?")}
                        className="text-left justify-start"
                      >
                        "What's the best way to get started?"
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {agentMessages.map(message => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} chat-message`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {message.type === 'agent' && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Robot className="h-4 w-4" />
                              <span className="text-xs font-medium">Learning Assistant</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="text-xs opacity-60 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isAgentTyping && (
                      <div className="flex justify-start chat-message">
                        <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%] agent-typing">
                          <div className="flex items-center space-x-2 mb-2">
                            <Robot className="h-4 w-4" />
                            <span className="text-xs font-medium">Learning Assistant</span>
                          </div>
                          <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Message Input */}
              <div className="flex-shrink-0 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && currentMessage.trim()) {
                          e.preventDefault();
                          sendMessageToAgent(currentMessage.trim());
                        }
                      }}
                      placeholder="Ask me about courses, progress, or learning recommendations..."
                      className="w-full p-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={isAgentTyping}
                    />
                    <Button
                      size="sm"
                      onClick={() => currentMessage.trim() && sendMessageToAgent(currentMessage.trim())}
                      disabled={!currentMessage.trim() || isAgentTyping}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    >
                      <PaperPlaneRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Press Enter to send</span>
                  <span>Powered by AI</span>
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