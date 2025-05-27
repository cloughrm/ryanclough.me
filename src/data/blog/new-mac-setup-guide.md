---
pubDatetime: 2023-01-28
modDatetime: 2025-03-12
title: New Mac Setup Guide
slug: new-mac-setup-guide
featured: false
draft: false
tags: ["macOS"]
ogImage: "../../assets/images/new-mac-setup.jpg"
description: As someone who builds software for a living & as a hobby - I go through lots of computers. I also like to occasionally wipe my machines and reinstall from a clean state. Therefore I spend a lot of time setting up new Apple computers. This blog is intended to be a living document of steps I take when setting up a new Mac.
---

As someone who builds software for a living & as a hobby - I go through lots of computers. I also like to occasionally wipe my machines and reinstall from a clean state. Therefore I spend a lot of time setting up new Apple computers. This blog is intended to be a living document of steps I take when setting up a new Mac.

## Stock Apps to Delete

- GarageBand
- iMovie
- Keynote
- Pages

## Apps to Install

- [1Password](https://1password.com/downloads/mac/)
- [VSCode](https://code.visualstudio.com/)
- [GitHub Desktop](https://desktop.github.com)
- [Brave](https://brave.com/)
  - Settings → Sync → Start using sync: `true`

## Browser: Brave

As of March 2025, my daily driver are Safari + [Brave](https://brave.com/).

### Set up Brave Sync

- Settings → Sync → Manage you synced devices

## Utilities to Install

- [Sensible Side Buttons](https://sensible-side-buttons.archagon.net/)
  - Menu Bar Settings
    - Enabled: `true`
    - Hide Menu Bar Icon: `true`
  - System Settings → General → Login Items → Open at Login: Add `/Applications/SensibleSideButtons.app`
- [Mos](https://mos.caldis.me)
  - Preferences → Miscellaneous → Launch on Login: `true`
  - Preferences → Miscellaneous → Hide Status Bar Icon: `true`

## Terminal

- Create Development Folder: mkdir `~/Dev`
- Install Command Line Developer Tools: `xcode-select --install`
- Disable Apple's Shell Session history ([Explanation](https://apple.stackexchange.com/a/427568))

  - Create zshenv file: `touch ~/.zshenv`

    ```bash
    SHELL_SESSIONS_DISABLE=1
    ```

### Terminal Theme

- [lysyi3m/macos-terminal-themes](https://github.com/lysyi3m/macos-terminal-themes)
  ```bash
  curl -o /tmp/idleToes.terminal "https://raw.githubusercontent.com/lysyi3m/macos-terminal-themes/master/themes/idleToes.terminal" && open /tmp/idleToes.terminal
  ```

### Terminal Preferences

- Profiles → Text
  - Text → Background → Color & Affects → Opacity: `95%`
  - Text → Font → Change → Size: `13`
  - Text → Cursor: `Vertical Bar`
- Profiles → Keyboard → Use Option as Meta key: `true`
- Profiles → Window
  - Path: `true`
  - Acvite process name: `false`
  - Dimensions: `false`
- Profiles: Click `Default` to save
- Edit Menu → Marks → Automatically Mark Prompt Lines: `false`

### Terminal Utilities

- Install Homebrew

  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

- Hush the login messages: `touch ~/.hushlogin`
- Install httpie: `brew install httpie node htop yt-dlp gh`

### .zshrc

Create a `.zshrc` with `touch ~/.zshrc` and add the following:

```bash
# Colors
export CLICOLOR=1

# Prompt
export PS1="%n@%m %1~ %# "

# Aliases
alias ll="ls -Flht"
alias ls="ls -F"
alias la="ls -Flhta"
alias activate="source env/bin/activate"
alias vactivate="source venv/bin/activate"

# Node.js
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
export LDFLAGS="-L/opt/homebrew/opt/node@18/lib"
export CPPFLAGS="-I/opt/homebrew/opt/node@18/include"

# Set PATH, MANPATH, etc., for Homebrew.
eval "$(/opt/homebrew/bin/brew shellenv)"

# Case insensitive tab completion
zstyle ':completion:*' matcher-list 'm:{[:lower:][:upper:]}={[:upper:][:lower:]}' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*'

# Automatic CD
setopt AUTO_CD

# ZSH History
export HISTSIZE=20000
export SAVEHIST=10000
setopt sharehistory # share history across multiple zsh sessions

# History search completion
autoload -U history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end
bindkey "^[[A" history-beginning-search-backward-end
bindkey "^[[B" history-beginning-search-forward-end

# Load the ZSH config changes
autoload -Uz compinit && compinit

# Prompt, git branch on right
function parse_git_branch() {
    git branch 2> /dev/null | sed -n -e 's/^\* \(.*\)/[\1]/p'
}
setopt PROMPT_SUBST
COLOR_DEFAULT=$'%f'
COLOR_ORANGE=$'%F{214}'
COLOR_GRAY=$'%F{243}'
export PROMPT='${COLOR_ORANGE}%1~ ➤${COLOR_DEFAULT} '
export RPROMPT='${COLOR_GRAY}$(parse_git_branch)${COLOR_DEFAULT}'

# Fun greeting from a random pokemon
fortune -s 50% computers 50% all | pokemonsay

# Docker fix for apple silicon
export DOCKER_DEFAULT_PLATFORM="linux/amd64"
source /Users/ryan/.docker/init-zsh.sh || true # Added by Docker Desktop
```

## VSCode Config

- Sign in with GitHub and sync everything

## System Settings

- Appearance
  - Appearance → Appearance: `Auto`
- Control Center
  - Control Center Modules → Bluetooth: `Show in Menu Bar`
  - Other Modules → Battery → Show Percentage: `true`
  - Menu Bar Only → Spotlight: `Don't Show in Menu Bar`
- Apple Intellignce & Siri
  - Listen for Hey Siri: Off
    - Siri voice: `Australian Voice 2`
- Spotlight
  - Search Privacy: Add `~/Dev`
  - Help Improve Apple Search: `false`
- Desktop and Dock:
  - Show suggested and recent applications in Dock: `false`
  - Position on screen: `Bottom`
  - Click wallpaper to reveal desktop: `Only in Stage Manager`
  - Tiled windows have margins: `false`
- Displays
  - Automatically adjust brightness: `false`
- Battery
  - Options → Slightly dim the display on battery: `false`
- Lock Screen
  - Turn display off on power adapter when inactive: `For 1 hour`
- Touch ID & Password
  - Apple Watch → Ryan’s Apple Watch: `true`
- Keyboard:
  - Key repeat rate: `7/8`
  - Delay until repeat: `5/6`

## Finder

- View → Show Path Bar
- Preferences → General → New Finder windows show: `ryan`

### Finder List View by Default

- Go → Go To Folder: `/`
- View → Show View Options (⌘ - J)
  - Always open in list view: `true`
  - Browser in list view: `true`
  - Sort by: `Name`
- Run in Terminal: `sudo find / -name ".DS_Store"  -exec rm {} \;`

### Finder + Desktop

- Click on desktop
- View → Show View Options (⌘ - J)
  - Sort by: `Name`

### Finder Sidebar:

- Favorites
  - AirDrop
  - Applications
  - ryan
  - Dev
  - Desktop
  - Downloads
- iCloud
  - iCloud Drive

## Notification Center

- Remove all widgets

## Messages

- Settings → iMessage → Enable Messages in iCloud: `true`

## Dock

- Downloads Stack → Right Click → View content as: `Grid`
- Downloads Stack → Right Click → Display as: `Folder`

## TextEdit

- Preferences → Format: `Plain Text`
- By default, open a new blank document (instead of asking which file to open):
  ```bash
  defaults write com.apple.TextEdit NSShowAppCentricOpenPanelInsteadOfUntitledFile -bool false
  ```
