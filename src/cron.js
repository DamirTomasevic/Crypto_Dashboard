import { createClient } from "@supabase/supabase-js";
import Moralis from "moralis";

const SUPABASE_URL = "https://xnskindbzrwyfphpweii.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhuc2tpbmRienJ3eWZwaHB3ZWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTg1NjcsImV4cCI6MjA2MDk5NDU2N30.kkRjkJjNCvrZ1cDCKqoLYognETQRrEatLwoMNo4ClJk";
const MORALIS_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijk1YTUyOGMwLTExMGUtNDk4MS04YmE5LWVjMDU3YmQ0OTI1MCIsIm9yZ0lkIjoiNDMyOTk5IiwidXNlcklkIjoiNDQ1NDEyIiwidHlwZUlkIjoiYTU3MWI1ODQtY2RkNS00NThkLWFkODUtNjc5Y2VkNzEwZTgwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDAyNDUxMDAsImV4cCI6NDg5NjAwNTEwMH0.MKvTkGS7Z7wBbc86PdPFh7gbtdx2kkj1tg22hwROmFg";
const TOKEN_ADDRESS = "0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9";
async function init_moralis() {
  try {
    await Moralis.start({
      apiKey: MORALIS_API_KEY,
    });
  } catch {
    // return
  }
}

async function getHoldersCount() {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    };

    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${TOKEN_ADDRESS}/holders?chain=pulse`,
      options
    );
    const result = await response.json();
    return result.totalHolders;
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
}

async function getTokenLiquidity() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": MORALIS_API_KEY,
    },
  };
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/erc20/${TOKEN_ADDRESS}/pairs?chain=pulse&limit=1`,
    options
  );
  const result = await response.json();
  return result.pairs[0].liquidity_usd;
}

async function getMarketCap() {
  try {
    const response = await Moralis.EvmApi.token.getTokenMetadata({
      chain: 369,
      addresses: [TOKEN_ADDRESS],
    });
    return response.raw[0].market_cap;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
}

// Define the data you want to insert
const insert_and_delete = async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  await init_moralis();
  const holders = parseInt(await getHoldersCount());
  const liquidity = parseFloat(await getTokenLiquidity()).toFixed(2);
  const marketcap = parseFloat(await getMarketCap()).toFixed(2);
  const data = {
    holders: holders,
    liquidity: liquidity,
    marketcap: marketcap,
    date: new Date().toISOString(), // Or a specific date string
  };
  const { data: insertedData, error } = await supabase
    .from("chart_data") // Replace with your actual table name
    .insert([data])
    .select(); // Optional: returns the inserted row(s)

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    const { data: allRows, error: fetchError } = await supabase
      .from("chart_data")
      .select("id, date")
      .order("date", { ascending: true });

    if (fetchError) {
      console.error("Error fetching rows:", fetchError.message);
      return;
    }
    if (allRows.length > 7) {
      const oldestId = allRows[0].id;
      const { error: deleteError } = await supabase
        .from("chart_data")
        .delete()
        .eq("id", oldestId);

      if (deleteError) {
        console.error("Error deleting oldest row:", deleteError.message);
      } else {
        console.log(`🗑️ Deleted oldest row with id ${oldestId}`);
      }
    } else {
      console.log("✅ No need to delete, total rows <= 7");
    }
  }
};
insert_and_delete();
