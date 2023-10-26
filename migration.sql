CREATE TABLE "musicians"(
    "id" SERIAL NOT NULL,
    "musician1" TEXT NOT NULL,
    "musician2" TEXT,
    "musician3" TEXT,
    "musician4" TEXT,
    "band_id" INTEGER NOT NULL
);
ALTER TABLE
    "musicians" ADD PRIMARY KEY("id");
CREATE TABLE "band"(
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL
);
ALTER TABLE
    "band" ADD PRIMARY KEY("id");
ALTER TABLE
    "musicians" ADD CONSTRAINT "musicians_band_id_foreign" FOREIGN KEY("band_id") REFERENCES "band"("id");