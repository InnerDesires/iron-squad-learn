import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "header_rels_pages_id_idx";
  DROP INDEX IF EXISTS "header_rels_posts_id_idx";
  DROP INDEX IF EXISTS "footer_rels_pages_id_idx";
  DROP INDEX IF EXISTS "footer_rels_posts_id_idx";
  ALTER TABLE "header_nav_items" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "header_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "footer_nav_items" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "footer_rels" ADD COLUMN "locale" "_locales";
  CREATE INDEX "header_nav_items_locale_idx" ON "header_nav_items" USING btree ("_locale");
  CREATE INDEX "header_rels_locale_idx" ON "header_rels" USING btree ("locale");
  CREATE INDEX "footer_nav_items_locale_idx" ON "footer_nav_items" USING btree ("_locale");
  CREATE INDEX "footer_rels_locale_idx" ON "footer_rels" USING btree ("locale");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id","locale");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id","locale");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id","locale");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id","locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "header_nav_items_locale_idx";
  DROP INDEX "header_rels_locale_idx";
  DROP INDEX "footer_nav_items_locale_idx";
  DROP INDEX "footer_rels_locale_idx";
  DROP INDEX "header_rels_pages_id_idx";
  DROP INDEX "header_rels_posts_id_idx";
  DROP INDEX "footer_rels_pages_id_idx";
  DROP INDEX "footer_rels_posts_id_idx";
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  ALTER TABLE "header_nav_items" DROP COLUMN "_locale";
  ALTER TABLE "header_rels" DROP COLUMN "locale";
  ALTER TABLE "footer_nav_items" DROP COLUMN "_locale";
  ALTER TABLE "footer_rels" DROP COLUMN "locale";`)
}
