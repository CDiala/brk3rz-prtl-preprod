# Troubleshooting Nx Dependency Constraints

This guide explains why your library is throwing the error:  
`A project without tags matching at least one constraint cannot depend on any libraries`

## The Problem

In an Nx monorepos, the `nx-enforce-module-boundaries` lint rule uses a **deny-by-default** approach. If a project has tags that do not perfectly align with your `depConstraints` configuration, the linter blocks all imports.

In your specific case, the **Guard Library** has two tags: `scope:shared` and `type:guard`. This causes a "double-bind" failure:

1.  **Rule Conflict:** Your `scope:shared` rule currently only allows dependencies on other `scope:shared` libs. Since your **Auth Library** is tagged `scope:auth`, the import is blocked.
2.  **Missing Definition:** You have no rule defined for `type:guard` in your config. When Nx sees a tag with no matching `sourceTag` in the `depConstraints` list, it assumes the project is unauthorized to have dependencies.

---

## Validated Solutions

### Option 1: Align Tags with Existing Rules (Recommended)

The cleanest fix is to ensure your library uses the tag for which you have already defined specific permissions.

**In `libs/guard/project.json`:**
Change the scope tag to match your existing guard rule.

```json
{
  "tags": ["scope:guard", "type:guard"]
}
```

**Why this works**: Your ESLint config already has a rule for scope:guard that explicitly allows scope:auth.

### Option 2: Update the ESLint Configuration

If you prefer to keep the scope:shared tag on the guard library, you must update your `eslint.config.js` to allow that scope to access Auth, and define the missing type constraint.

In `depConstraints`:

```javascript
depConstraints: [
  {
    sourceTag: 'scope:shared',
    // Add 'scope:auth' to allow shared libs to import from auth
    onlyDependOnLibsWithTags: ['scope:shared', 'scope:auth'],
  },
  {
    // Define the missing type tag to satisfy the "at least one constraint" requirement
    sourceTag: 'type:guard',
    onlyDependOnLibsWithTags: ['*'],
  },
  // ... rest of your rules
];
```

### Key Takeaways

- **AND Logic**: If a project has multiple tags (e.g., `scope:x` and `type:y`), it must pass the rules for **both** tags. If one tag blocks an import, the linting fails.

- **Exhaustive Rules**: Every tag used in a `project.json` should have a corresponding `sourceTag` entry in your lint rules to avoid the "no matching constraints" error.

---

# Improving performance by rendering an image of different sizes based on screen size

1. **Prepare your local assets**: Resize your image (`red.webp`) into the specific widths Angular is recommending (and a few others for common devices). Save them in your assets (`public` in this case) folder like this:

- public/red-400.webp
- public/red-800.webp
- public/red-1400.webp (This matches the recommended ~1372w)

2. **Configure a Custom Loader**: In your app.config.ts (or AppModule), provide an IMAGE_LOADER that maps the requested width to your file naming convention:

```javascript
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

// In your providers array
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      // If width is provided (from ngSrcset), use the resized file
      if (config.width) {
        return `assets/${config.src.replace('.webp', '')}-${config.width}.webp`;
      }
      // Fallback for the base ngSrc
      return `assets/${config.src}`;
    }
  }
]
```

**Note**: for more modern angular projects with `public` file instead of `assets`, remove the `assets/` from the snippet above

3. **Update your HTML**: Now, use the ngSrcset attribute with width descriptors. Angular will use your loader to generate the final srcset URLs.

```javascript
<img
  class="absolute bottom-0"
  ngSrc="red.webp"
  [width]="1342"
  [height]="196"
  ngSrcset="400w, 800w, 1400w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Responsive red image"
/>
```

### Why this fixes the error:

**The Error:** It was complaining because you were downloading a 5000px file but only showing it at roughly 686px.

**The Fix:** By adding `ngSrcset="1400w"`, the browser on a standard screen will now only download your new `red-1400.webp` file, which is much closer to the recommended size. The "Maximum DPR of 2" note means Angular wants a file roughly double your rendered width `(686 x 2 = 1372)` to look sharp on high-resolution screens.
