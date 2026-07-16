# Artwork Tools

Two tools retrieve artwork through the Bridge. Available images are returned as base64 data URLs in the Bridge result.

## fb2k_artwork_get_current

Gets artwork for the currently playing track.

- **Bridge method**: `artwork.getCurrent`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | No | One of `front`, `back`, `disc`, `icon`, or `artist`; the Bridge defaults to `front` when omitted |

**Example result when artwork is available:**

```json
{
  "available": true,
  "type": "front",
  "source": "album_art_manager_v2",
  "mimeType": "image/jpeg",
  "size": 245678,
  "dataUrl": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

| Field | Type | Description |
| --- | --- | --- |
| `available` | boolean | Whether artwork was found |
| `type` | string | Requested artwork type |
| `source` | string | Retrieval source when reported, such as `now_playing_manager`, `album_art_manager_v2`, or `extractor` |
| `mimeType` | string | Detected MIME type |
| `size` | integer | Image size in bytes |
| `dataUrl` | string | Base64-encoded Data URL |

**Example result when no artwork is available:**

```json
{ "available": false, "type": "front", "reason": "no_track" }
```

## fb2k_artwork_get_for_track

Gets artwork for a specified track file.

- **Bridge method**: `artwork.getForTrack`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Track file path |
| `type` | string | No | One of `front`, `back`, `disc`, `icon`, or `artist`; the Bridge defaults to `front` when omitted |

**Result:** The availability, MIME type, byte size, dimensions when detected, and `dataUrl` are returned by the Bridge.

## Artwork types

| Value | Meaning |
| --- | --- |
| `front` | Front cover and Bridge default |
| `back` | Back cover |
| `disc` | Disc artwork |
| `icon` | Icon artwork |
| `artist` | Artist artwork |
