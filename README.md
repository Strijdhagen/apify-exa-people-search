# Exa People Search - Apify Actor

[![Exa People Search Actor](https://apify.com/actor-badge?actor=fantastic-jobs/exa-ai-people-search)](https://apify.com/fantastic-jobs/exa-ai-people-search)

An open-source Apify Actor wrapper for [Exa.ai](https://exa.ai)'s powerful people search API. Find professionals on LinkedIn and other platforms using natural language queries powered by AI.

## 🎯 What is This?

This Actor integrates [Exa.ai's people search](https://exa.ai/blog/people-search-benchmark) with Apify's workflow automation platform. Exa uses hybrid retrieval combining fine-tuned embeddings with neural search, trained on 1B+ people profiles.

**You bring your own Exa API key** - this Actor just handles the integration with Apify's platform.

## ✨ Key Features

- 🤖 **AI-Powered Search** - Natural language queries using Exa's neural search
- 🎯 **Role-Based Discovery** - Find professionals by job function, seniority, location
- 🌍 **Global Coverage** - Search across 195+ countries  
- 📊 **Rich Profile Data** - LinkedIn URLs, titles, images, and optional full text
- ⚡ **Fast & Accurate** - State-of-the-art people search benchmarks
- 💰 **Transparent Costs** - Pay only for Exa API usage + Apify compute

## 🚀 Getting Started

### 1. Get an Exa API Key

1. Sign up at [exa.ai](https://exa.ai)
2. Get your API key from the [dashboard](https://dashboard.exa.ai)
3. **$10 in free credits** to start (as of December 2025)

### 2. Run the Actor

Add your Exa API key in the Actor input form. The key is marked as secret and encrypted - it will never be exposed in logs or to the Actor creator.

## 📝 Input

### Required Fields

**Exa API Key** (`exaApiKey`)
- Your Exa.ai API key
- Get one at https://exa.ai
- **Secure**: Encrypted and never exposed in logs or to the Actor creator

**Search Query** (`query`)
- Natural language description of who you're looking for
- Examples:
  - `"VP of Engineering at fintech startups in London"`
  - `"Senior ML engineers with NLP experience in Berlin"`
  - `"Founders of sustainable fashion brands in Europe"`

### Optional Fields

**User Location** (`userLocation`)
- ISO 2 country code to bias results
- Default: `US`
- Choose from 195+ countries

**Number of Results** (`numResults`)
- How many people to return (1-100)
- Default: `10`

**Include Text Content** (`includeText`)
- Enable to get full profile text
- Default: `false`
- Adds $1 per 1,000 results (as of Dec 2025)

**Max Characters** (`maxCharacters`)
- Maximum characters to retrieve per profile when text is enabled
- Range: 100-10,000
- Default: `2000`

**Highlights Query** (`highlightsQuery`)
- Optional query to extract relevant highlights/snippets from profiles
- Returns AI-selected excerpts matching your query
- Example: `"machine learning"`, `"B2B sales experience"`
- Adds $1 per 1,000 results (as of Dec 2025)

**Sentences per Highlight** (`numSentences`)
- Number of sentences to return per highlight
- Range: 1-10, Default: 3
- Only applies when Highlights Query is set

**Highlights per Result** (`highlightsPerUrl`)
- Maximum number of highlights per person
- Range: 1-10, Default: 3
- Only applies when Highlights Query is set
- Note: Increases Exa API costs

## 📤 Output

Results are stored in the Apify dataset. Each result includes:

```json
{
  "id": "https://exa.ai/library/person/...",
  "title": "Jane Smith | VP of Engineering at Acme Corp",
  "url": "https://linkedin.com/in/janesmith",
  "author": "Jane Smith",
  "publishedDate": "2025-11-18T17:29:45.000Z",
  "image": "https://media.licdn.com/.../profile-photo.jpg",
  "text": "Full profile content (if includeText enabled)...",
  "highlights": [
    "Led machine learning team of 15 engineers...",
    "Specialized in deep learning architectures..."
  ],
  "highlightScores": [0.89, 0.76]
}
```

### Field Descriptions

- **id** - Unique Exa identifier for the person
- **title** - Full title including name and current position
- **url** - Direct link to their professional profile (usually LinkedIn)
- **author** - Person's name
- **publishedDate** - When the profile was last updated (if available)
- **image** - Profile photo URL
- **text** - Full profile content (only if `includeText` is enabled)
- **highlights** - AI-selected relevant excerpts (only if `highlightsQuery` is provided)
- **highlightScores** - Relevance scores for each highlight (0-1 scale)

### Search Metadata

Metadata is stored in the key-value store under `search-metadata`:

```json
{
  "requestId": "abc123...",
  "resolvedSearchType": "neural",
  "searchTime": 947.5,
  "costDollars": {
    "total": 0.053,
    "search": { "neural": 0.025 },
    "contents": { "text": 0.028 }
  },
  "query": "your search query",
  "userLocation": "US",
  "numResults": 10,
  "includeText": false,
  "resultCount": 10,
  "executedAt": "2025-12-18T10:30:00.000Z"
}
```

## 💰 Pricing

### Exa API Costs

This Actor uses your Exa API credits. From [Exa's pricing](https://exa.ai/pricing) (as of December 2025):

**Search:**
- 1-25 results: $5 per 1,000 requests ($0.005 per search)
- 26-100 results: $25 per 1,000 requests ($0.025 per search)

**Text Content:**
- $1 per 1,000 pages ($0.001 per result)

**Highlights:**
- $1 per 1,000 pages ($0.001 per result)

**Examples:**
- 10 results (no text): $0.005
- 50 results (no text): $0.025
- 50 results (with text): $0.025 + $0.05 = $0.075
- 100 results (with text): $0.025 + $0.10 = $0.125

### Apify Platform Costs

Standard Apify compute costs apply based on:
- Memory usage
- Runtime duration
- Platform plan

See [Apify pricing](https://apify.com/pricing) for details.

## 🎨 Use Cases

### Sales & Business Development
```json
{
  "query": "VP of Sales at SaaS companies in New York",
  "userLocation": "US",
  "numResults": 50
}
```

### Recruiting & Talent Acquisition
```json
{
  "query": "Senior DevOps engineers with Kubernetes in Singapore",
  "userLocation": "SG",
  "numResults": 100,
  "includeText": true,
  "highlightsQuery": "kubernetes docker terraform experience"
}
```

### Market Research
```json
{
  "query": "CTOs at Series A healthcare startups",
  "userLocation": "US",
  "numResults": 50,
  "includeText": true
}
```

### Investor Relations
```json
{
  "query": "Managing partners at VC firms in San Francisco",
  "userLocation": "US",
  "numResults": 25
}
```

## 💡 Best Practices

### Writing Effective Queries

✅ **Be Specific**
- Good: `"Head of Design at fintech companies in Toronto"`
- Bad: `"designer"`

✅ **Use Natural Language**
- `"VP of Product with SaaS experience in Seattle"`
- `"Senior data scientists working on computer vision"`

✅ **Combine Multiple Criteria**
- `"Senior software engineers with React at scale-ups in Amsterdam"`

✅ **Experiment with Variations**
- Try: `"Founders of ecommerce startups"` vs `"CEOs at DTC brands"`

### Optimizing Costs

- Start with small searches (10-25 results) to test queries
- Only enable `includeText` when you need full profiles
- Use specific queries to get better results with fewer searches
- Monitor costs in the metadata output

### Location Targeting

- Use `userLocation` to bias toward a country
- Include city names in your query for local results
- Combine both: `userLocation: "DE"` + query with "Berlin"

## 🔗 Integration Examples

### CRM Export
Chain with Apify integrations to export to:
- HubSpot
- Salesforce  
- Google Sheets
- Airtable

### Scheduled Searches
Set up recurring searches to:
- Monitor competitor hiring
- Track industry trends
- Build evergreen lead lists

### Enrichment Workflows
1. Search for target profiles (this Actor)
2. Enrich with company data
3. Score and qualify leads
4. Export to your CRM

## ⚙️ Local Development

```bash
# Clone the repository
git clone https://github.com/Strijdhagen/apify-exa-people-search.git
cd apify-deep-people-search

# Install dependencies
npm install

# Set your Exa API key in .env
echo "EXA_API_KEY=your_key_here" > .env

# Create test input
cat > storage/key_value_stores/default/INPUT.json << EOF
{
  "exaApiKey": "your_key_here",
  "query": "Senior software engineer in Amsterdam",
  "userLocation": "NL",
  "numResults": 10,
  "includeText": false
}
EOF

# Run locally
npm start
```

## 📚 Resources

- [Exa.ai Documentation](https://docs.exa.ai/)
- [Exa People Search Benchmark](https://exa.ai/blog/people-search-benchmark)
- [Exa Pricing](https://exa.ai/pricing)
- [Apify Documentation](https://docs.apify.com/)
- [Apify SDK](https://docs.apify.com/sdk/js)

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT - see [LICENSE](LICENSE) file for details

## ⚠️ Limitations

- Maximum 100 results per search (standard API limit, 1,000 for Custom plans)
- Text content configurable from 100 to 10,000 characters per result
- Results depend on publicly available profile information
- Rate limits apply based on your Exa subscription tier

## 🆘 Support

- **Exa API Issues**: Contact [Exa support](https://exa.ai)
- **Actor Issues**: Open an issue on [GitHub](https://github.com/Strijdhagen/apify-exa-people-search)
- **Apify Platform**: Check [Apify docs](https://docs.apify.com/)

---

**Powered by [Exa.ai](https://exa.ai) | Built for [Apify](https://apify.com)**
