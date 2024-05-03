# Setup

1. Setup tor:

Get a hash: `tor --hash-password giraffe`

Or copy paste in torrc:

```
ControlPort 9051
HashedControlPassword 16:BD4135FB9C9A3BE36075807ABB15BEF7BFB00FDCA05253AF2557B8AC71
```

If fucking wsl, change ports:

```
SocksPort 127.0.0.1:9151
ControlPort 9152
HashedControlPassword 16:BD4135FB9C9A3BE36075807ABB15BEF7BFB00FDCA05253AF2557B8AC71
```

2. Install dep : `npm install`

# Run

1. Run tor cli
2. Run ton script avec `node index.js`
