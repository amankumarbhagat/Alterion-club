-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'PAST');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ATTENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "AnnouncementCategory" AS ENUM ('RECRUITMENT', 'EVENT', 'ALERT', 'GENERAL');

-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('EVENTS', 'WORKSHOPS', 'MEETINGS', 'HACKATHONS', 'PROJECTS', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "lead_id" UUID,
    "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ongoing_work" TEXT NOT NULL DEFAULT '',
    "icon_name" VARCHAR(50) NOT NULL DEFAULT 'Code',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "division_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "github" VARCHAR(255) NOT NULL DEFAULT '',
    "linkedin" VARCHAR(255) NOT NULL DEFAULT '',
    "image_url" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_leadership" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "problem" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mentor_faculty_id" UUID,
    "mentor_member_id" UUID,
    "external_mentor_name" VARCHAR(100),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "github_url" VARCHAR(255) NOT NULL DEFAULT '',
    "demo_url" VARCHAR(255) NOT NULL DEFAULT '',
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "role_in_project" VARCHAR(100) NOT NULL DEFAULT 'Contributor',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "event_date" DATE NOT NULL,
    "event_time" VARCHAR(50) NOT NULL,
    "venue" VARCHAR(150) NOT NULL,
    "coordinator_id" UUID,
    "external_coordinator_name" VARCHAR(100),
    "image_url" TEXT NOT NULL DEFAULT '',
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "registration_link" VARCHAR(255) NOT NULL DEFAULT '',
    "registration_enabled" BOOLEAN NOT NULL DEFAULT true,
    "winners" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "gallery_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "college" VARCHAR(150) NOT NULL DEFAULT 'BMSIT&M',
    "usn" VARCHAR(30) NOT NULL DEFAULT '',
    "branch" VARCHAR(100) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "team_name" VARCHAR(100),
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "date_achieved" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL DEFAULT '',
    "badge" VARCHAR(100) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "date_posted" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "category" "AnnouncementCategory" NOT NULL DEFAULT 'GENERAL',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "logo_url" TEXT NOT NULL DEFAULT '',
    "partner_type" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "category" "GalleryCategory" NOT NULL DEFAULT 'EVENTS',
    "event_id" UUID,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "branch" VARCHAR(100) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "division_id" UUID NOT NULL,
    "skills" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "projects" TEXT NOT NULL DEFAULT '',
    "github" VARCHAR(255) NOT NULL DEFAULT '',
    "linkedin" VARCHAR(255) NOT NULL DEFAULT '',
    "portfolio" VARCHAR(255) NOT NULL DEFAULT '',
    "resume_url" TEXT NOT NULL DEFAULT '',
    "resume_name" VARCHAR(255) NOT NULL DEFAULT '',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "admin_notes" TEXT NOT NULL DEFAULT '',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "admin_reply" TEXT NOT NULL DEFAULT '',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_coordinators" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "designation" VARCHAR(150) NOT NULL,
    "department" VARCHAR(150) NOT NULL,
    "image_url" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "office" VARCHAR(150) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_coordinators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_metrics_config" (
    "id" UUID NOT NULL,
    "override_computed_stats" BOOLEAN NOT NULL DEFAULT false,
    "manual_projects_count" INTEGER,
    "manual_events_count" INTEGER,
    "manual_members_count" INTEGER,
    "manual_divisions_count" INTEGER,
    "manual_partners_count" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_metrics_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_email_idx" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_is_active_idx" ON "admin_users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_name_key" ON "divisions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_slug_key" ON "divisions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_lead_id_key" ON "divisions"("lead_id");

-- CreateIndex
CREATE INDEX "members_division_id_idx" ON "members"("division_id");

-- CreateIndex
CREATE INDEX "members_is_leadership_idx" ON "members"("is_leadership");

-- CreateIndex
CREATE INDEX "members_is_active_idx" ON "members"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_mentor_faculty_id_idx" ON "projects"("mentor_faculty_id");

-- CreateIndex
CREATE INDEX "projects_mentor_member_id_idx" ON "projects"("mentor_member_id");

-- CreateIndex
CREATE INDEX "project_members_project_id_idx" ON "project_members"("project_id");

-- CreateIndex
CREATE INDEX "project_members_member_id_idx" ON "project_members"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_project_id_member_id_key" ON "project_members"("project_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "events_coordinator_id_idx" ON "events"("coordinator_id");

-- CreateIndex
CREATE INDEX "event_registrations_event_id_idx" ON "event_registrations"("event_id");

-- CreateIndex
CREATE INDEX "event_registrations_email_idx" ON "event_registrations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_event_id_email_key" ON "event_registrations"("event_id", "email");

-- CreateIndex
CREATE INDEX "achievements_featured_idx" ON "achievements"("featured");

-- CreateIndex
CREATE INDEX "announcements_is_active_idx" ON "announcements"("is_active");

-- CreateIndex
CREATE INDEX "announcements_category_idx" ON "announcements"("category");

-- CreateIndex
CREATE INDEX "gallery_items_category_idx" ON "gallery_items"("category");

-- CreateIndex
CREATE INDEX "gallery_items_event_id_idx" ON "gallery_items"("event_id");

-- CreateIndex
CREATE INDEX "applications_division_id_idx" ON "applications"("division_id");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_submitted_at_idx" ON "applications"("submitted_at");

-- CreateIndex
CREATE INDEX "contact_messages_is_read_idx" ON "contact_messages"("is_read");

-- CreateIndex
CREATE INDEX "contact_messages_submitted_at_idx" ON "contact_messages"("submitted_at");

-- AddForeignKey
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_mentor_faculty_id_fkey" FOREIGN KEY ("mentor_faculty_id") REFERENCES "faculty_coordinators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_mentor_member_id_fkey" FOREIGN KEY ("mentor_member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_coordinator_id_fkey" FOREIGN KEY ("coordinator_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
