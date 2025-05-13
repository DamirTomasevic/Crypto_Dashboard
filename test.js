import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xnskindbzrwyfphpweii.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhuc2tpbmRienJ3eWZwaHB3ZWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTg1NjcsImV4cCI6MjA2MDk5NDU2N30.kkRjkJjNCvrZ1cDCKqoLYognETQRrEatLwoMNo4ClJk";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fetchLast7Rows = async () => {
  const { data, error } = await supabase
    .from("chart_data")
    .select("holders, liquidity, marketcap, date")
    .order("date", { ascending: false })
    .limit(7);

  if (error) {
    console.error("Error fetching data:", error.message);
  } else {
    // Reverse to get ascending order (oldest first)
    const sortedData = data.reverse();
    console.log("Last 7 records:", sortedData);
  }
};

fetchLast7Rows();
