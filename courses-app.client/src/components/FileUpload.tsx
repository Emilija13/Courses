import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import type { Course } from "@/types";

interface FileUploadProps {
  courses: Course[];
  onFileUpload: () => void;
}

export default function FileUpload({ courses, onFileUpload }: FileUploadProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

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
        `http://localhost:8000/api/courses/${selectedCourse}/upload`,
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
      setSelectedCourse("");
      formElement.reset();
      onFileUpload();
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!selectedCourse) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/courses/${selectedCourse}/files/${fileId}`,
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
      onFileUpload();
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the file.");
    }
  };

  const handleDownload = (filePath: string) => {
    const url = `http://localhost:8000/storage/${filePath}`;
    window.open(url, "_blank");
  };

  const selectedCourseData = courses.find(
    (c) => c.id.toString() === selectedCourse
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Course Files
          </CardTitle>
          <CardDescription>Add files to your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Select Course</Label>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={!selectedCourse || isUploading}>
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedCourseData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Files in {selectedCourseData.name}
            </CardTitle>
            <CardDescription>
              {selectedCourseData.files.length} file(s) uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCourseData.files.length > 0 ? (
              <div className="space-y-2">
                {selectedCourseData.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{file.filename}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded on{" "}
                          {new Date(file.created_at).toLocaleDateString(
                            "en-CA"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(file.filepath)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No files uploaded yet for this course
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
