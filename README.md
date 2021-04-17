# Daily posts

## Endpoints

| name         | description                             | url             | query                                                                 | Example                                    |
| :----------- | :-------------------------------------- | :-------------- | :-------------------------------------------------------------------- | :----------------------------------------- |
| Posts        | Get posts from `reddit` and `medium`.   | `/posts`        | **Optional:**`all` if set, scraper will return 10 posts instead of 3. | `/posts?all=true`                          |
| Reddit posts | Get posts from specific sub `reddit`.   | `/reddit-posts` | **Required:** `subReddit`                                             | `/reddit-posts?subReddit=programming`      |
| Medium posts | Get posts from specific `medium` topic. | `/medium-posts` | **Required:** `topic`                                                 | `/medium-posts?topic=software-engineering` |
