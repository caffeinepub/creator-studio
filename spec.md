# Florida Dave Video Requests

## Current State
The app has a fully styled booking modal with a form (name, recipient, message, email, optional file upload) and a placeholder "Pay with PayPal / Stripe" button that does nothing. Payment is not connected to any real provider.

## Requested Changes (Diff)

### Add
- When the user clicks the pay button inside the booking modal, open a real PayPal payment link using Florida Dave's PayPal email (davidmcfddn77@gmail.com) with the correct amount pre-filled for the selected video option.
- After clicking Pay with PayPal, show a note instructing the fan to include their name/request in the PayPal note field.

### Modify
- Replace the placeholder pay button with a live PayPal.Me-style link that opens PayPal in a new tab with the correct amount pre-filled using `https://www.paypal.com/paypalme/[username]/[amount]` or `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=[email]&amount=[amount]&currency_code=USD` format.
- Update success message to remind fans to check email AND that payment was sent via PayPal.

### Remove
- The "Secure payment coming soon" placeholder text — replace with real PayPal link behavior.

## Implementation Plan
1. In BookingModal.tsx, wire the Pay with PayPal button to open a PayPal payment URL using `https://www.paypal.com/paypalme/fortnitebuster/{price}` (Florida Dave's PayPal.Me handle derived from the Cameo handle, or use direct email link).
   - Use PayPal direct payment link: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=davidmcfddn77%40gmail.com&amount={price}&currency_code=USD&item_name={videoTitle}`
   - Open in new tab on click.
2. Add a small helper note below the button: "Include your name and request in the PayPal note."
3. Update the form submit to also mark payment as initiated.
4. Keep all existing form validation intact.
