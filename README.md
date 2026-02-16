You are a senior frontend engineer.

Generate a complete production-ready static web project named:

"Truck Insurance Quote"

The output must exactly match the following technical specifications.

--------------------------------------------------
PROJECT STRUCTURE (MANDATORY)
--------------------------------------------------

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
FORM SUBMISSION CONFIGURATION
--------------------------------------------------

The form MUST submit via POST to:

https://formsubmit.co/ae9cde1290fb998e04fe7ac5287e8765

Include these hidden fields inside the form:

<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_template" value="table">
<input type="hidden" name="_subject" value="New Truck Insurance Submission">

Allow one file upload:
- input type="file"
- name="attachment"
- max size: 10MB (validate in JS)
- show file name + size
- include remove file button that clears input

--------------------------------------------------
ADDRESS AUTOCOMPLETE CONFIGURATION
--------------------------------------------------

Use Geoapify API.

API KEY:
7036f365f5d04562aea31633f8ffd7cc

Autocomplete endpoint:
https://api.geoapify.com/v1/geocode/autocomplete

Query parameters:
- text={user input}
- limit=5
- filter=countrycode:us
- apiKey=7036f365f5d04562aea31633f8ffd7cc

Requirements:
- Debounce input by 300ms
- Minimum 3 characters before calling API
- Display dropdown suggestions
- Click suggestion fills input
- Close dropdown on outside click

Apply to:
- Mailing Address (id="mailingAddress")
- Garaging Address (id="garagingAddress")

--------------------------------------------------
DESIGN REQUIREMENTS
--------------------------------------------------

Modern professional UI.

Font stack:
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif

Colors:
Primary: #2563eb
Primary hover: #1e4ed8
Remove buttons: #dc2626
Success: #28a745
Warning: #fd7e14
Error: #dc3545

• Rounded corners
• Soft shadows
• Compact spacing
• Inline remove buttons
• Responsive layout
• Hide number spinners cross-browser
• Use accent-color for radios
• Proper focus states
• Reduced motion support

--------------------------------------------------
LAYOUT STRUCTURE
--------------------------------------------------

Use a wrapper:

<div class="page-wrapper">

Desktop:
[ LOGO LEFT ]   [ FORM CENTERED ]

Mobile (max-width: 1024px):
Logo hidden.

Logo path:
images/logo.jpg

--------------------------------------------------
SECTIONS (IN EXACT ORDER)
--------------------------------------------------

1) General Information

Fields:
- Company Name | DBA (required)
- ELD Provider (optional)
- Phone (required)
- Email (required)
- DOT# (required)
- Legal Status (select: Corporation, LLC, Sole Proprietor, Partnership, Individual)

Layout:
Company + ELD side by side
Other 4 fields in single responsive row

--------------------------------------------------

2) Addresses

- Mailing Address (required)
- Garaging Address (required)
- Apply Geoapify autocomplete

--------------------------------------------------

3) Drivers / Owners (Dynamic)

Start with one row.
Button: + Add Driver

Each row (.row-item):
- Driver Type (select: Driver / Owner)
- Full Name
- DOB (type=date)
- License Number
- License State (2-letter uppercase)
- Date Hired (type=date)
- Inline Remove button

Rules:
- Only ONE Owner allowed
- Selecting Owner disables Owner option in other rows
- If trying to add second Owner → show alert
- Removing Owner re-enables option

--------------------------------------------------

4) Trucks (Dynamic)

Start with one row.
Fields:
- Year (number)
- Make
- Type (Tractor, Box, Flatbed, Reefer, Tanker, Other)
- GVW (number)
- VIN
- Remove button

--------------------------------------------------

5) Trailers (Dynamic)

Start with one row.
Fields:
- Year
- Make
- Type (Dry Van, Reefer, Flatbed, Tanker, Other)
- VIN
- Remove button

--------------------------------------------------

6) Cargo (Dynamic)

Start with one row.
Fields:
- Commodity
- Percentage (number 0–100)

Live total indicator below list.
Use aria-live="polite".

Color rules:
- 100% → green (#28a745)
- <100% → orange (#fd7e14)
- >100% → red (#dc3545)

On submit:
- Must equal exactly 100%
- If not → prevent submit + alert

--------------------------------------------------

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

Each coverage:
- Yes / No radio (default No)

If Yes selected:

For ALL coverages EXCEPT "Reefer Breakdown":
    - Show Limit ($)
    - Show Deductible ($)

For "Reefer Breakdown":
    - Show Deductible ($) ONLY
    - Do NOT include a Limit field

If No selected:
    - Hide fields
    - Clear values

--------------------------------------------------
TECHNICAL RULES
--------------------------------------------------

• Vanilla JS only
• All dynamic blocks use .row-item
• Use DOMContentLoaded
• Use event listeners (not inline onclick)
• Clean code structure
• No console errors
• Fully responsive at ~768px
• Accessibility compliant
• Use proper label wrapping
• Prevent layout shift

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