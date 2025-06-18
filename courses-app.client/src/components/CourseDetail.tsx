import type React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Award,
  FileText,
  Download,
  Upload,
  LogOut,
  Trash2,
} from "lucide-react";
import type { Course, Student, CourseFile } from "@/types";
import { useEffect, useState } from "react";

interface CourseDetailProps {
  currentUser: string;
  userRole: "professor" | "student";
  onLogout: () => void;
}

export default function CourseDetail({
  currentUser,
  userRole,
  onLogout
}: CourseDetailProps) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("materials");
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[] | null>(
    null
  );
  const token = localStorage.getItem("token");

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/courses/${courseId}/students`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      setEnrolledStudents(data);
    } catch (err) {
      console.error("Failed to fetch course", err);
    }
  };
  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/courses/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setCourse(data);
    } catch (err) {
      console.error("Failed to fetch course", err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchStudents();
    }
  }, [courseId, selectedTab]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-4">
              The course you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const fileInput = formElement.file as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8000/api/courses/${courseId}/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        const error = await response.json();
        alert("Upload failed: " + error.message);
        return;
      }
      formElement.reset();
      const result = await response.json();
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    }
  };

  const handleDelete = async (fileId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/courses/${courseId}/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert("Delete failed: " + error.message);
        return;
      }

      alert("File deleted successfully!");
      fetchCourse();
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the file.");
    }
  };

  const handleDownload = (filePath: string) => {
    const url = `http://localhost:8000/storage/${filePath}`;
    window.open(url, "_blank");
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold">EduManage</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    Instructor:{" "}
                    {course.professor.name + " " + course.professor.surname}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created:{" "}
                    {new Date(course.created_at).toLocaleDateString("en-CA")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration} weeks</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="text-sm">
                <Award className="w-4 h-4 mr-1" />
                {course.level}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {course.category}
              </Badge>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {course.students_count}
                    </p>
                    <p className="text-sm text-gray-600">Enrolled Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {course?.files?.length}
                    </p>
                    <p className="text-sm text-gray-600">Course Materials</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{course.duration}</p>
                    <p className="text-sm text-gray-600">Weeks Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Tabs
          defaultValue="materials"
          className="space-y-6"
          onValueChange={(value) => setSelectedTab(value)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
            {userRole === "professor" && (
              <TabsTrigger value="students">Enrolled Students</TabsTrigger>
            )}
            {userRole === "professor" && (
              <TabsTrigger value="manage">Manage Files</TabsTrigger>
            )}
            {userRole === "student" && (
              <TabsTrigger value="progress">My Progress</TabsTrigger>
            )}
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Course Materials
                </CardTitle>
                <CardDescription>
                  Download and access all course materials and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.files.length > 0 ? (
                  <div className="grid gap-3">
                    {course?.files?.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-gray-500" />
                          <div>
                            <p className="font-medium">{file.filename}</p>
                            <p className="text-sm text-gray-500">
                              {file.filesize} • Uploaded on{" "}
                              {new Date(file.created_at).toLocaleDateString(
                                "en-CA"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleDownload(file.filepath)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          {userRole === "professor" && (
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(file.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No materials yet
                    </h3>
                    <p className="text-gray-600">
                      {userRole === "professor"
                        ? "Upload course materials to get started."
                        : "Course materials will appear here when uploaded by your instructor."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab (Admin only) */}
          {userRole === "professor" && (
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Enrolled Students ({enrolledStudents?.length})
                  </CardTitle>
                  <CardDescription>
                    View and manage students enrolled in this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledStudents && enrolledStudents.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {enrolledStudents?.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              {student.name.charAt(0) +
                                student.surname.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {student.name + " " + student.surname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.index}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No students enrolled
                      </h3>
                      <p className="text-gray-600">
                        Students will appear here when enrolled in this course.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Manage Files Tab (Admin only) */}
          {userRole === "professor" && (
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Course Materials
                  </CardTitle>
                  <CardDescription>
                    Add new files and resources for this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file">Select File</Label>
                      <Input
                        id="file"
                        name="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png,.mp4,.mp3"
                        required
                      />
                      <p className="text-sm text-gray-500">
                        Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG,
                        PNG, MP4, MP3
                      </p>
                    </div>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? (
                        "Uploading..."
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Progress Tab (Student only) */}
          {userRole === "student" && (
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    My Progress
                  </CardTitle>
                  <CardDescription>
                    Track your progress in this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Course Completion</span>
                        <span>{course.progress || 65}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: `${course.progress || 65}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Materials Accessed</h4>
                        <p className="text-2xl font-bold text-green-600">
                          3/{course.files?.length}
                        </p>
                        <p className="text-sm text-gray-500">
                          Files downloaded
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Time Spent</h4>
                        <p className="text-2xl font-bold text-green-600">24h</p>
                        <p className="text-sm text-gray-500">
                          Total study time
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
