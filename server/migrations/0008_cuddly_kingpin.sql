CREATE TABLE IF NOT EXISTS "email_token" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "email_token_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
DROP TABLE "email_tokens";