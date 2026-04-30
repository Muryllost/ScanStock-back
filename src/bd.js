import postgres from "postgres";

const sql = postgres(
  "postgresql://postgres:[YOUR-PASSWORD]@db.wagwessyhwhdzrnyyuio.supabase.co:5432/postgres",
);

export default sql;
