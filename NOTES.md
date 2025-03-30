### TODO:
- post details, fixed image size
- consistent link/button styling across heading links, tags
- Share on linkedin button not working on mobile

### Done
- code block colors
- remove default content
- set up deployment for ryanclough.me
- Implement header 
- Implement social links
- implement share links
- Replace suggest changes with share links
- Remove the header animations
- re-add mac blog post

### Installing fonts
https://docs.astro.build/en/guides/fonts/, specifically used fontsource method

### Images
Astro will optimized images within the src directory, to use one in markdown: 
![AstroPaper v5](@/assets/images/AstroPaper-v5.png)

https://unsplash.com for royality free images


### Blog post ideas
- observer: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
- Deep dive on cookies 
- CSS layer vs z-index
```
/* @layer controls which style rule wins */
@layer base {
  .button { background: blue; }
}
@layer custom {
  .button { background: red; }  /* This wins because custom layer comes after base */
}

/* z-index controls visual stacking of elements */
.modal { 
  z-index: 10;  /* Modal appears above the overlay */
}
.overlay {
  z-index: 5;   /* Overlay appears above normal content but below modal */
}
```