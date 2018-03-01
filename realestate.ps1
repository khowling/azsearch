$env:REACT_APP_SEARCH_METADATA = '{
      "search_apikey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "search_url": "https://xxxxxxxx.search.windows.net",
      "header1": "Realestate - Sample Portal",
      "header2": "You can now personalize your searches with over 8 million possible options. You design it. We provide it.",
      "index_meta": {
        "REALESTATE-US": {
            "display_cols": [
                {"type":"link1", "vals": [{"val": "listingId", "id": "listingId"}]},
                {"vals": [{"val": "description"}]},
                {"type":"link2", "vals": [{"val": "city"}, {"val": "region"}]}, 
                {"type": "pills", "vals": [{"val": "status"}, {"val": "source"}, {"val": "price"}]}],
            "facet_cols": [
                "beds", 
                "baths", 
                "status", 
                "region", 
                "daysOnMarket"
            ],
            "index": "xxxxxxxxxxxxxxxx"
        }
      }
    }'