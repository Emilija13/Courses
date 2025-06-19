import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CourseCreationProps {
  onSuccess: () => void;
}

export default function CourseCreation({ onSuccess }: CourseCreationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const formData = new FormData(e.target as HTMLFormElement);
    const courseData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      duration: formData.get("duration") as string,
      level: formData.get("level") as string,
      professor_id: localStorage.getItem("userId"),
    };

    try {
      const response = await fetch("http://localhost:8000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.status === 201) {
        const createdCourse = await response.json();
        alert("Course successfully created");
        onSuccess();
        //after api call switch to first tab
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create course");
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }

    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Course Title</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter course name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="literature">Literature</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Course Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide a detailed description of the course"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (weeks)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            placeholder="12"
            min="1"
            max="52"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Difficulty Level</Label>
          <Select name="level" required>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          "Creating Course..."
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </>
        )}
      </Button>
    </form>
  );
}
