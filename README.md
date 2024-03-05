# Base ExpressJS

Base ExpressJS is a basic source code, using Express FrameWork

## Usage

1. Clone project
2. Create `.env` file and config in `.env`:

-   Config Digital Ocean

```bash
DO_SPACES_ENDPOINT=
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_NAME=
DO_DOMAIN=
DO_FILE_SONG=
DO_FILE_THUMBNAIL=
DO_FILE_LYRIC=
```

-   Config Project

```bash
DEV_PORT=
SERVER_API=
```

3. Install package & setup

```bash
npm install
```

4. Run project
```bash
npm run dev
```

5. Click to link in log of terminal -> access from browser

6. Copy song's id => paste field

7. Press '<b>Get song</b>' to get detail for song

8. Download 4 path to /src/uploads with name:
```bash
  __id__.mp3
  __id__x96.jpg
  __id__x240.jpg
  __id__.lrc
```

9. Press '<b>Upload file</b>' and watch log in terminal to know status of file.
