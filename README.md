This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


## Azure Search React App

Create  App can generate a web based facet'ed search experiance powered by Azure Search,  you need to configure it to work against your Azure Search Index using the environment variable `REACT_APP_SEARCH_METADATA`:


## Configure the app

Once you have created your Asure Search Index, you can clone this app locally, and configure it to run against your index

### Step 1 - create your `REACT_APP_SEARCH_METADATA` environment variable

This environment variable containes all the metadata the app needs to run, you can create a `ENV.sh` or `ENV.ps1` that will set this as follows:

```
$env:REACT_APP_SEARCH_METADATA = '{
      "search_apikey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "search_url": "https://xxxxxxxx.search.windows.net",
      "header1": "My Project - Search Portal",
      "header2": "You can now search your data with over 8 million possible options. At lightning speeds",
      "index_meta": {
        "Index1": {
            "display_cols": [
              {
                  "type":"link1", 
                  "vals": [
                      {
                        "val": "CustomerName", 
                        "id": "CustomerNameID"
                    }
                  ]
              },
              {
                "vals": [
                    {
                        "val": "CustomerStatus", 
                    }
                ]
              }
            ],

            "facet_cols": [
              "CustomerStatus",
              "Country"
            ],

            "index": "search-index-name"
        }
      }
    }'

```

* `search_apikey` from the azure portal;
* `search_url` from the azure portal;
* `header1` any text that will show in your sites header;
* `header12` any text that will show in your sites header;
* `index_meta` this describes the name and structure of your seach index (you can have multiple indexes);
  * `Index1` this is a arbitrary label for your index for the UI;
    * `display_cols` this is a array the lists how each returned element in the search document will be displayed;
      * `type` this defines the display format type of the elements, values here are: `link1` - for header link, `link2` - for subtitle link, `pill` - for label,  or ommitted for flat text span;
      * `vals` this  is a array of element names to be displayed from the returned document (if type == link, you need to specify the `val`, and `id` elements here, otherwise, just `val`)
    * `facet_cols` this is a array the lists  each  element in the search document to use as a facet;
    * `index` !IMPORTANT! this is the name of your Azure search index from the Azure portal;


## Step 2 - Run your app

Now, run your environment file, and start your app
```
$ . .\ENV.sh
$ npm start
```

