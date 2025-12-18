import { Actor, log } from "apify";
import dotenv from "dotenv";

// Load environment variables from .env file for local development
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

await Actor.init();

try {
    // Get input with validation
    const input = await Actor.getInput();
    
    if (!input) {
        throw new Error("Input is required. Please provide a search query.");
    }

    const { 
        exaApiKey,
        query, 
        userLocation = "US", 
        numResults = 10,
        includeText = false,
        maxCharacters = 2000,
        highlightsQuery,
        numSentences = 3,
        highlightsPerUrl = 3
    } = input;

    if (!query || typeof query !== "string" || query.trim() === "") {
        throw new Error("Search query is required and must be a non-empty string.");
    }

    // Validate numResults
    const limit = Math.min(Math.max(1, numResults), 100);
    
    // Get Exa API key from input or environment
    const apiKey = exaApiKey || process.env.EXA_API_KEY;
    
    if (!apiKey) {
        throw new Error("Exa API key is required. Please provide your Exa API key in the input field. Get one at https://exa.ai");
    }

    log.info("Starting Exa people search", { 
        query: query.substring(0, 50) + (query.length > 50 ? "..." : ""),
        userLocation, 
        numResults: limit,
        includeText 
    });

    // Initialize Exa client
    const ExaClient = (await import("exa-js")).default;
    const exa = new ExaClient(apiKey);

    // Build search options
    const searchOptions = {
        category: "people",
        numResults: limit,
        type: "auto",
        userLocation,
    };

    // Add text content options if enabled
    if (includeText) {
        searchOptions.text = {
            maxCharacters: Math.min(Math.max(100, maxCharacters), 10000),
        };
    }

    // Add highlights if query is provided
    if (highlightsQuery && highlightsQuery.trim()) {
        searchOptions.highlights = {
            query: highlightsQuery.trim(),
            numSentences: Math.min(Math.max(1, numSentences), 10),
            highlightsPerUrl: Math.min(Math.max(1, highlightsPerUrl), 10),
        };
    }

    log.debug("Executing Exa search with options", searchOptions);

    // Execute Exa search
    const response = await exa.search(query, searchOptions);

    if (!response || !response.results) {
        throw new Error("Invalid response from Exa API");
    }

    log.info(`Found ${response.results.length} people matching the query`);

    // Push results to dataset
    if (response.results.length > 0) {
        await Actor.pushData(response.results);
        log.info(`Successfully pushed ${response.results.length} results to dataset`);
    } else {
        log.warning("No results found for the given query");
    }

    // Store search metadata in key-value store for reference
    const store = await Actor.openKeyValueStore();
    await store.setValue("search-metadata", {
        requestId: response.requestId,
        resolvedSearchType: response.resolvedSearchType,
        searchTime: response.searchTime,
        costDollars: response.costDollars,
        query,
        userLocation,
        numResults: limit,
        includeText,
        resultCount: response.results.length,
        executedAt: new Date().toISOString(),
    });

    log.info("Search completed successfully", {
        requestId: response.requestId,
        searchType: response.resolvedSearchType,
        resultCount: response.results.length,
        exaCost: response.costDollars,
    });

} catch (error) {
    log.error("Actor failed", { error: error.message });
    await Actor.fail(error.message);
}

await Actor.exit();
