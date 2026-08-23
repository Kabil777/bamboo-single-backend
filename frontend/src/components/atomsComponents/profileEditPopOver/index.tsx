"use client";
import { Button } from "@/components/shadcnUI/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnUI/select";
import { Plus, X, Upload, Loader2, Check, Trash } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaYoutube,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import Image from "next/image";
import { useState, useRef } from "react";

import { ReactNode } from "react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  designation: string;
  handle: string;
  description: string;
  tags: string[];
  socialLinks: SocialLink[];
  profileImage: string;
}

interface SharePopoverProps {
  profileData: ProfileData;
  onSave: (data: ProfileData) => void;
  children: ReactNode;
}

const platformIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  website: FaGlobe,
  youtube: FaYoutube,
  facebook: FaFacebook,
  instagram: FaInstagram,
};

const socialPlatforms = [
  { value: "github", label: "GitHub", icon: FaGithub },
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { value: "twitter", label: "Twitter", icon: FaTwitter },
  { value: "website", label: "Website", icon: FaGlobe },
  { value: "youtube", label: "YouTube", icon: FaYoutube },
  { value: "facebook", label: "Facebook", icon: FaFacebook },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
];

const defaultProfileImages = [
  "https://github.com/shadcn.png",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Pattern1",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Pattern2",
  "https://api.dicebear.com/7.x/initials/svg?seed=User",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Person1",
];

export const ProfileEditPopOver = ({
  profileData,
  onSave,
  children,
}: SharePopoverProps) => {
  const [firstName, setFirstName] = useState(profileData.firstName);
  const [lastName, setLastName] = useState(profileData.lastName);
  const [designation, setDesignation] = useState(profileData.designation);
  const [handle, setHandle] = useState(profileData.handle);
  const [description, setDescription] = useState(profileData.description);
  const [tags, setTags] = useState<string[]>(profileData.tags);
  const [tagInput, setTagInput] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    profileData.socialLinks,
  );
  const [profileImage, setProfileImage] = useState<string>(
    profileData.profileImage,
  );
  const [showImageSuggestions, setShowImageSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedTags = [
    "Developer",
    "Designer",
    "Writer",
    "Photographer",
    "Creator",
    "Artist",
    "Engineer",
    "Entrepreneur",
    "Student",
    "Teacher",
    "Manager",
    "Freelancer",
  ];

  const filteredTags = tagInput.trim()
    ? predefinedTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !tags.includes(tag),
      )
    : predefinedTags.filter((tag) => !tags.includes(tag));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setShowImageSuggestions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setShowImageSuggestions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectDefaultImage = (imageUrl: string) => {
    setProfileImage(imageUrl);
    setShowImageSuggestions(false);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setShowTagSuggestions(false);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === "Escape") {
      setShowTagSuggestions(false);
    } else if (
      e.key === "ArrowDown" &&
      showTagSuggestions &&
      filteredTags.length > 0
    ) {
      e.preventDefault();
      // Focus first suggestion
    }
  };

  const addSocialLink = () => {
    if (socialLinks.length < 5) {
      setSocialLinks([
        ...socialLinks,
        {
          id: Date.now().toString(),
          platform: "github",
          url: "",
          icon: "github",
        },
      ]);
    }
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  const updateSocialLink = (
    id: string,
    field: "platform" | "url",
    value: string,
  ) => {
    setSocialLinks(
      socialLinks.map((link) =>
        link.id === id
          ? {
              ...link,
              [field]: value,
              ...(field === "platform" ? { icon: value } : {}),
            }
          : link,
      ),
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    const updatedData: ProfileData = {
      firstName,
      lastName,
      designation,
      handle,
      description,
      tags: tags,
      socialLinks,
      profileImage,
    };

    // Simulate async save
    setTimeout(() => {
      onSave(updatedData);
      setIsLoading(false);
      setIsSaved(true);

      // Close dialog after showing success
      setTimeout(() => {
        setIsOpen(false);
        setIsSaved(false);
      }, 1500);
    }, 1000);
  };

  const handleCancel = () => {
    // Reset to original values
    setFirstName(profileData.firstName);
    setLastName(profileData.lastName);
    setDesignation(profileData.designation);
    setHandle(profileData.handle);
    setDescription(profileData.description);
    setTags(profileData.tags);
    setTagInput("");
    setSocialLinks(profileData.socialLinks);
    setProfileImage(profileData.profileImage);
    setIsOpen(false);
  };

  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      designation.trim() !== "" &&
      handle.trim() !== "" &&
      tags.length > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl ">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information, social links, and profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-8 max-h-[75vh] overflow-y-auto px-2 custom-scroll">
          {/* Profile Image Upload */}
          <div className="flex flex-col gap-6 pb-9 border-b">
            <Label className="text-lg font-semibold">Profile Picture</Label>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Main Profile Image */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative group"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div
                    className={`w-36 h-36 rounded-2xl flex items-center justify-center overflow-hidden border-0 transition-all ${
                      isDragging
                        ? "border-primary border-dashed scale-105 bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    {profileImage ? (
                      <Image
                        width={144}
                        height={144}
                        src={profileImage}
                        alt="Profile"
                        className={`w-full h-full object-cover transition-opacity pt-1 ${isDragging ? "opacity-50" : "opacity-100"}`}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm text-center px-2">
                        {isDragging ? "Drop image here" : "No image"}
                      </span>
                    )}
                    {isDragging && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                        <Upload className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="absolute -bottom-3 -right-3 rounded-full p-2.5 h-10 w-10 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-5 w-5" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium text-center">
                  Click or drag & drop
                </span>
              </div>

              {/* Default Images Grid */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[220px] overflow-y-auto pr-2 p-3 custom-scroll">
                  {defaultProfileImages.map((img, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 hover:border-primary transition-all duration-200 ${
                        profileImage === img
                          ? "border-primary border-3"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                      onClick={() => selectDefaultImage(img)}
                    >
                      <Image
                        width={60}
                        height={60}
                        src={img}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover aspect-square"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-7">
            <Label className="text-lg font-semibold">
              Personal Information
            </Label>

            <div className="flex gap-5">
              <div className="grid flex-1 gap-3">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="grid flex-1 gap-3">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="grid flex-1 gap-3">
                <Label htmlFor="designation" className="text-sm font-medium">
                  Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="grid flex-1 gap-3">
                <Label htmlFor="handleName" className="text-sm font-medium">
                  Handle <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    @
                  </span>
                  <Input
                    id="handleName"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="h-11 pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid flex-1 gap-3">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="grid flex-1 gap-3">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="flex items-center gap-2 min-h-[44px] p-2 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-foreground text-background rounded-md text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-primary/20 rounded-sm transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowTagSuggestions(true);
                      }}
                      onFocus={() => setShowTagSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowTagSuggestions(false), 200)
                      }
                      onKeyDown={handleTagInputKeyDown}
                      placeholder={
                        tags.length === 0 ? "Type to search or add tags..." : ""
                      }
                      className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Autocomplete Dropdown */}
                {showTagSuggestions && filteredTags.length > 0 && (
                  <div className="absolute z-50 w-full mt-3 bg-background border rounded-lg shadow-lg max-h-[200px] overflow-y-auto custom-scroll">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addTag(tag);
                          setShowTagSuggestions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Plus className="h-3 w-3 text-muted-foreground" />
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                Press Enter or comma to add. Start typing for suggestions.
              </span>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="grid gap-4 pt-6 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">
                Social Links ({socialLinks.length}/5)
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addSocialLink}
                disabled={socialLinks.length >= 5}
                className="h-9 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link) => {
                const IconComponent =
                  platformIcons[link.icon as keyof typeof platformIcons];
                return (
                  <div
                    key={link.id}
                    className="flex items-end gap-3 p-4 border rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <div className="grid flex-1 gap-3">
                      <Label className="text-sm font-medium">Platform</Label>
                      <Select
                        value={link.platform}
                        onValueChange={(value) =>
                          updateSocialLink(link.id, "platform", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              {IconComponent && (
                                <IconComponent className="h-4 w-4" />
                              )}
                              <span className="capitalize">
                                {link.platform}
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map((platform) => {
                            const Icon = platform.icon;
                            return (
                              <SelectItem
                                key={platform.value}
                                value={platform.value}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{platform.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid flex-[2] gap-3">
                      <Label className="text-sm font-medium">URL</Label>
                      <Input
                        placeholder={`https://${link.platform}.com/username`}
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(link.id, "url", e.target.value)
                        }
                        className="h-11"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="default"
                      onClick={() => removeSocialLink(link.id)}
                      className="h-11 px-3"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {socialLinks.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-xl bg-muted/20">
                No social links added yet. Click &quot;Add Link&quot; to add
                one.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-3 pb-1 border-t sticky -bottom-1 bg-background">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-11 relative"
              onClick={handleSave}
              disabled={isLoading || isSaved || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Saved Successfully!
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};