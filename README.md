You are an expert senior frontend engineer.

Generate a complete production-ready static web project called:

"Truck Insurance Quote"

The project must exactly reflect the following structure and behavior.

--------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------

Folder structure must be:

public/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    └── logo.jpg

No frameworks.
No libraries.
No build tools.
Vanilla HTML, CSS, JavaScript only.

--------------------------------------------------
GENERAL REQUIREMENTS
--------------------------------------------------

• Modern, clean, professional UI
• Rounded corners
• Soft shadows
• Compact layout
• Fully responsive
• Desktop: logo on left, form centered
• Tablet/mobile: logo hidden
• Flexbox + CSS Grid
• System font stack:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif

Primary color: #2563eb
Primary hover: #1e4ed8
Remove buttons: #dc2626
Success (100%): #28a745
Warning (<100%): #fd7e14
Error (>100%): #dc3545

--------------------------------------------------
FORM SUBMISSION
--------------------------------------------------

Form must POST to:

https://formsubmit.co/ae9cde1290fb998e04fe7ac5287e8765

Hidden fields:
- _captcha = false
- _template = table
- _subject = "New Truck Insurance Submission"

Allow one file upload.
Max 10MB.
Display file name + size.
Include remove file button.

--------------------------------------------------
LAYOUT
--------------------------------------------------

Use a .page-wrapper flex layout:

Desktop:
[ LOGO ]   [ FORM ]

Mobile:
[ FORM ONLY ]

Hide logo at max-width: 1024px.

--------------------------------------------------
SECTIONS (IN ORDER)
--------------------------------------------------

1) General Information
- Company Name | DBA (required)
- ELD Provider (optional)
- Phone (required)
- Email (required)
- DOT# (required)
- Legal Status (select)

Layout:
- Company + ELD side by side
- Phone/Email/DOT/Legal in single responsive row

2) Addresses
- Mailing Address (required)
- Garaging Address (required)
- Geoapify autocomplete (US only)
- Debounced API call

3) Drivers / Owners (dynamic)
- Start with one row
- Add Driver button
- Inline Remove button
- Fields:
  - Driver Type (Driver / Owner)
  - Full Name
  - DOB
  - License #
  - License State
  - Date Hired
- Only ONE Owner allowed
- Selecting Owner disables Owner option in other rows
- Removing Owner re-enables option

4) Trucks (dynamic)
- Start with one row
- Fields:
  - Year
  - Make
  - Type (Tractor, Box, Flatbed, Reefer, Tanker, Other)
  - GVW
  - VIN

5) Trailers (dynamic)
- Start with one row
- Fields:
  - Year
  - Make
  - Type (Dry Van, Reefer, Flatbed, Tanker, Other)
  - VIN

6) Cargo (dynamic)
- Start with one row
- Fields:
  - Commodity
  - Percentage (0-100)
- Live total indicator below
- Color rules:
  - 100% = green
  - <100% = orange
  - >100% = red
- Must enforce exactly 100% on submit
- Prevent submit + alert if invalid

7) Coverage & Limits Requested
Static grid.
Coverages:
- Auto Liability
- Uninsured Motorist
- Cargo
- Reefer Breakdown
- Physical Damage
- Trailer Interchange
- General Liability
- Hired Auto
- Non-Trucking Liability

For each:
- Yes / No radio (default No)
- If Yes → show:
  - Limit ($)
  - Deductible ($)
- If No → hide and clear values

--------------------------------------------------
TECHNICAL REQUIREMENTS
--------------------------------------------------

• Vanilla JS only
• All dynamic rows use .row-item
• Use event listeners (no frameworks)
• Proper label wrapping
• Use accent-color for radios
• Hide number spinners cross-browser
• Proper :focus styles
• Responsive breakpoint ~768px
• Reduced motion support
• Good accessibility
• aria-live for cargo total
• Inline remove buttons (not absolute positioned)

--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------

Respond with EXACTLY THREE code blocks:

1) index.html
2) css/style.css
3) js/script.js

Do not include explanations.
Do not include documentation.
Only output code.