# Winmem CLI

`winmem` is a self-hosting and operations CLI.
It supports:
- repository bootstrap (`init`)
- docker compose lifecycle (`up`, `down`, `logs`, `status`)
- project management (`add-project`, `remove-project`)
- audit + export helpers (`audit`, `export`)
- backups (`backup`)
- diagnostics (`doctor`)
- optional Kubernetes/Helm helpers (`deploy`)

The CLI is designed to work with the repo layout in this monorepo.
