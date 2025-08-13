import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "media_locales" (
  	"alt" varchar,
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  DROP INDEX IF EXISTS "pages_rels_pages_id_idx";
  DROP INDEX IF EXISTS "pages_rels_posts_id_idx";
  DROP INDEX IF EXISTS "pages_rels_categories_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_pages_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_posts_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_categories_id_idx";

  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_cta_links' AND column_name = '_locale') THEN
      ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "_locale" "_locales";
      UPDATE "pages_blocks_cta_links" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_cta' AND column_name = '_locale') THEN
      ALTER TABLE "pages_blocks_cta" ADD COLUMN "_locale" "_locales";
      UPDATE "pages_blocks_cta" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "pages_blocks_cta" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_content_columns' AND column_name = '_locale') THEN
      ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "_locale" "_locales";
      UPDATE "pages_blocks_content_columns" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_content' AND column_name = '_locale') THEN
      ALTER TABLE "pages_blocks_content" ADD COLUMN "_locale" "_locales";
      UPDATE "pages_blocks_content" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "pages_blocks_content" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_media_block' AND column_name = '_locale') THEN
      ALTER TABLE "pages_blocks_media_block" ADD COLUMN "_locale" "_locales";
      UPDATE "pages_blocks_media_block" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_archive' AND column_name = '_locale') THEN
      ALTER TABLE "pages_blocks_archive" ADD COLUMN "_locale" "_locales";
      UPDATE "pages_blocks_archive" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "pages_blocks_archive" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_form_block' AND column_name = '_locale') THEN
      ALTER TABLE "pages_blocks_form_block" ADD COLUMN "_locale" "_locales";
      UPDATE "pages_blocks_form_block" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;
  END $$;

  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_locales' AND column_name = 'title') THEN
      ALTER TABLE "pages_locales" ADD COLUMN "title" varchar;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_locales' AND column_name = 'hero_rich_text') THEN
      ALTER TABLE "pages_locales" ADD COLUMN "hero_rich_text" jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_rels' AND column_name = 'locale') THEN
      ALTER TABLE "pages_rels" ADD COLUMN "locale" "_locales";
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_cta_links' AND column_name = '_locale') THEN
      ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "_locale" "_locales";
      UPDATE "_pages_v_blocks_cta_links" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_cta' AND column_name = '_locale') THEN
      ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "_locale" "_locales";
      UPDATE "_pages_v_blocks_cta" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_content_columns' AND column_name = '_locale') THEN
      ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "_locale" "_locales";
      UPDATE "_pages_v_blocks_content_columns" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_content' AND column_name = '_locale') THEN
      ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "_locale" "_locales";
      UPDATE "_pages_v_blocks_content" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "_pages_v_blocks_content" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_media_block' AND column_name = '_locale') THEN
      ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "_locale" "_locales";
      UPDATE "_pages_v_blocks_media_block" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_archive' AND column_name = '_locale') THEN
      ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "_locale" "_locales";
      UPDATE "_pages_v_blocks_archive" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_form_block' AND column_name = '_locale') THEN
      ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "_locale" "_locales";
      UPDATE "_pages_v_blocks_form_block" SET "_locale" = 'uk' WHERE "_locale" IS NULL;
      ALTER TABLE "_pages_v_blocks_form_block" ALTER COLUMN "_locale" SET NOT NULL;
    END IF;
  END $$;

  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_locales' AND column_name = 'version_title') THEN
      ALTER TABLE "_pages_v_locales" ADD COLUMN "version_title" varchar;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_locales' AND column_name = 'version_hero_rich_text') THEN
      ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_rich_text" jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_rels' AND column_name = 'locale') THEN
      ALTER TABLE "_pages_v_rels" ADD COLUMN "locale" "_locales";
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts_locales' AND column_name = 'title') THEN
      ALTER TABLE "posts_locales" ADD COLUMN "title" varchar;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts_locales' AND column_name = 'content') THEN
      ALTER TABLE "posts_locales" ADD COLUMN "content" jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v_locales' AND column_name = 'version_title') THEN
      ALTER TABLE "_posts_v_locales" ADD COLUMN "version_title" varchar;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v_locales' AND column_name = 'version_content') THEN
      ALTER TABLE "_posts_v_locales" ADD COLUMN "version_content" jsonb;
    END IF;
  END $$;

  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'media_locales_parent_id_fk') THEN
      ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'categories_locales_parent_id_fk') THEN
      ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_links_locale_idx" ON "pages_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_locale_idx" ON "pages_blocks_cta" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_columns_locale_idx" ON "pages_blocks_content_columns" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_locale_idx" ON "pages_blocks_content" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_media_block_locale_idx" ON "pages_blocks_media_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_archive_locale_idx" ON "pages_blocks_archive" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_block_locale_idx" ON "pages_blocks_form_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_links_locale_idx" ON "_pages_v_blocks_cta_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_locale_idx" ON "_pages_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_columns_locale_idx" ON "_pages_v_blocks_content_columns" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_locale_idx" ON "_pages_v_blocks_content" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_block_locale_idx" ON "_pages_v_blocks_media_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_archive_locale_idx" ON "_pages_v_blocks_archive" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_block_locale_idx" ON "_pages_v_blocks_form_block" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id","locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id","locale");
  CREATE INDEX IF NOT EXISTS "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id","locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id","locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id","locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id","locale");

  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'title') THEN
      ALTER TABLE "pages" DROP COLUMN "title";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'hero_rich_text') THEN
      ALTER TABLE "pages" DROP COLUMN "hero_rich_text";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v' AND column_name = 'version_title') THEN
      ALTER TABLE "_pages_v" DROP COLUMN "version_title";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v' AND column_name = 'version_hero_rich_text') THEN
      ALTER TABLE "_pages_v" DROP COLUMN "version_hero_rich_text";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'title') THEN
      ALTER TABLE "posts" DROP COLUMN "title";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'content') THEN
      ALTER TABLE "posts" DROP COLUMN "content";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_title') THEN
      ALTER TABLE "_posts_v" DROP COLUMN "version_title";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_content') THEN
      ALTER TABLE "_posts_v" DROP COLUMN "version_content";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media' AND column_name = 'alt') THEN
      ALTER TABLE "media" DROP COLUMN "alt";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media' AND column_name = 'caption') THEN
      ALTER TABLE "media" DROP COLUMN "caption";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'title') THEN
      ALTER TABLE "categories" DROP COLUMN "title";
    END IF;
  END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP INDEX "pages_blocks_cta_links_locale_idx";
  DROP INDEX "pages_blocks_cta_locale_idx";
  DROP INDEX "pages_blocks_content_columns_locale_idx";
  DROP INDEX "pages_blocks_content_locale_idx";
  DROP INDEX "pages_blocks_media_block_locale_idx";
  DROP INDEX "pages_blocks_archive_locale_idx";
  DROP INDEX "pages_blocks_form_block_locale_idx";
  DROP INDEX "pages_rels_locale_idx";
  DROP INDEX "_pages_v_blocks_cta_links_locale_idx";
  DROP INDEX "_pages_v_blocks_cta_locale_idx";
  DROP INDEX "_pages_v_blocks_content_columns_locale_idx";
  DROP INDEX "_pages_v_blocks_content_locale_idx";
  DROP INDEX "_pages_v_blocks_media_block_locale_idx";
  DROP INDEX "_pages_v_blocks_archive_locale_idx";
  DROP INDEX "_pages_v_blocks_form_block_locale_idx";
  DROP INDEX "_pages_v_rels_locale_idx";
  DROP INDEX "pages_rels_pages_id_idx";
  DROP INDEX "pages_rels_posts_id_idx";
  DROP INDEX "pages_rels_categories_id_idx";
  DROP INDEX "_pages_v_rels_pages_id_idx";
  DROP INDEX "_pages_v_rels_posts_id_idx";
  DROP INDEX "_pages_v_rels_categories_id_idx";
  ALTER TABLE "pages" ADD COLUMN "title" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_rich_text" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_rich_text" jsonb;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  ALTER TABLE "media" ADD COLUMN "caption" jsonb;
  ALTER TABLE "categories" ADD COLUMN "title" varchar NOT NULL;
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "_locale";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "_locale";
  ALTER TABLE "pages_locales" DROP COLUMN "title";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_rich_text";
  ALTER TABLE "pages_rels" DROP COLUMN "locale";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "_locale";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_rich_text";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "locale";
  ALTER TABLE "posts_locales" DROP COLUMN "title";
  ALTER TABLE "posts_locales" DROP COLUMN "content";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_content";`)
}
