# Configure Ink API Endpoint

## Overview
This API endpoint handles the configuration of pen ink by creating custom ink configurations with specific colors, types, and properties. Ink configuration is essential for personalizing the writing experience.

## Endpoint
```
POST /api/configure_ink
```

## Authentication
- Uses JWT token stored in HTTP-only cookie named "pen"
- Token contains `penId` for tracking pen configuration sessions
- Token expires in 48 hours

## Request Body

### Required Fields
- `description` (string): Description of the ink configuration
- `type_name` (string): Type/name of the ink
- `colour` (string): Color name of the ink
- `hex_code` (string): Hex color code for the ink

## Example Request
```json
{
  "description": "Premium blue fountain pen ink",
  "type_name": "Waterproof Blue",
  "colour": "Royal Blue",
  "hex_code": "#4169E1"
}
```

## Response

### Success Responses

#### Existing Pen (Cookie Present)
- **Status**: 200 OK
- **Body**: `"Pen updated successfully"`

#### New Pen Creation
- **Status**: 201 Created
- **Headers**: 
  - `Set-Cookie`: JWT token for pen session
- **Body**: `"New pen created with Ink"`

### Error Responses

#### No Data Sent
- **Status**: 400 Bad Request
- **Body**: `"NO DATA SENT"`

#### Ink Creation Error
- **Status**: 400 Bad Request
- **Body**: Error details from InkData

#### Token Decode Error
- **Status**: 400 Bad Request
- **Body**: `"Unable to decode cookie"`

#### Database Errors
- **Status**: 400 Bad Request
- **Body**: Error details from database operations

## Business Logic

1. **Validation**: Checks if request body exists
2. **Fixed Cost**: Ink configuration has a fixed cost of 1000 units
3. **Database Storage**: Inserts ink configuration into `InkConfig` table
4. **Pen Management**:
   - If pen session exists: Updates existing pen with ink configuration using `update_ink_details` RPC
   - If no session: Creates new pen with ink configuration and sets cookie
5. **Session Tracking**: Uses JWT cookies to maintain pen configuration state

## Database Tables Used
- `InkConfig`: Stores ink configuration details
- `Pen`: Stores pen records and references

## Database Functions Used
- `update_ink_details`: RPC function to update existing pen with ink configuration
  - Parameters:
    - `new_barrel_id`: ID of the created ink configuration (Note: parameter name suggests barrel but is actually ink_type_id)
    - `amount_to_add`: Cost to add to the pen (fixed at 1000)
    - `row_id`: ID of the pen to update

## Dependencies
- Supabase client for database operations
- JWT for session management

## Key Features
- **Fixed Pricing**: All ink configurations cost 1000 units
- **Simple Configuration**: Only requires basic ink properties (type, color, hex code)
- **Session Management**: Integrates with pen configuration workflow
- **Color Support**: Supports both named colors and hex codes

## Notes
- Ink configuration has a simplified structure compared to other components
- Fixed cost model makes pricing predictable
- The RPC function parameter name `new_barrel_id` is misleading but actually refers to `ink_type_id`
- No optional components like material or design (unlike cap/barrel configurations)
- Essential for complete pen configuration as ink determines writing color and properties

## Ink Configuration Schema
The ink configuration stores:
- **Description**: User-defined description
- **Type Name**: Ink type (e.g., "Waterproof", "Quick-dry", "Permanent")
- **Color Name**: Human-readable color name
- **Hex Code**: Precise color specification
- **Fixed Cost**: Always 1000 units
