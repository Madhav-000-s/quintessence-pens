# Configure Barrel API Endpoint

## Overview
This API endpoint handles the configuration of pen barrels by creating custom barrel designs with various materials, designs, engravings, and coatings. The barrel configuration includes grip type and shape specifications.

## Endpoint
```
POST /api/configure_barrel
```

## Authentication
- Uses JWT token stored in HTTP-only cookie named "pen"
- Token contains `penId` for tracking pen configuration sessions
- Token expires in 48 hours

## Request Body

### Required Fields
- `description` (string): Description of the barrel configuration
- `grip_type` (string): Type of grip for the barrel
- `shape` (string): Shape of the barrel (Note: there's a typo in the code - `sahpe` instead of `shape`)

### Optional Fields

#### Material Configuration
```json
{
  "material": {
    "name": "string" // Material name
  }
}
```

#### Design Configuration
```json
{
  "design": {
    "description": "string", // Design description
    "font": "string",        // Font style
    "colour": "string",      // Color name
    "hex_code": "string"     // Hex color code
  }
}
```

#### Engraving Configuration
```json
{
  "engraving": {
    "font": "string",        // Engraving font
    "type_name": "string",   // Type of engraving
    "description": "string"  // Engraving description
  }
}
```

#### Coating Configuration
```json
{
  "coating": {
    "colour": "string",      // Coating color
    "hex_code": "string",    // Hex color code
    "type": "string"         // Coating type
  }
}
```

## Example Request
```json
{
  "description": "Premium barrel with ergonomic grip",
  "grip_type": "Rubber",
  "shape": "Tapered",
  "material": {
    "name": "Aluminum"
  },
  "design": {
    "description": "Textured grip pattern",
    "font": "Arial",
    "colour": "Black",
    "hex_code": "#000000"
  },
  "engraving": {
    "font": "Bold",
    "type_name": "Laser",
    "description": "Company name"
  },
  "coating": {
    "colour": "Matte",
    "hex_code": "#2C2C2C",
    "type": "Anti-slip"
  }
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
- **Body**: `"New pen created with barrel"`

### Error Responses

#### No Data Sent
- **Status**: 400 Bad Request
- **Body**: `"NO DATA SENT"`

#### Barrel Creation Error
- **Status**: 400 Bad Request
- **Body**: `"not able to ccreate barrel"`

#### Token Decode Error
- **Status**: 400 Bad Request
- **Body**: `"Unable to decode cookie"`

#### Database Errors
- **Status**: 400 Bad Request
- **Body**: Error details from database operations

## Business Logic

1. **Validation**: Checks if request body exists
2. **Component Creation**: Creates optional components (material, design, engraving, coating) if provided
3. **Cost Calculation**: Automatically calculates total cost by summing individual component costs
4. **Database Storage**: Inserts barrel configuration into `BarrelConfig` table
5. **Pen Management**:
   - If pen session exists: Updates existing pen with barrel configuration using `update_barrel_details` RPC
   - If no session: Creates new pen with barrel configuration and sets cookie
6. **Session Tracking**: Uses JWT cookies to maintain pen configuration state

## Database Tables Used
- `BarrelConfig`: Stores barrel configuration details
- `Pen`: Stores pen records and references
- Various component tables for materials, designs, engravings, etc.

## Database Functions Used
- `update_barrel_details`: RPC function to update existing pen with barrel configuration
  - Parameters:
    - `new_barrel_id`: ID of the created barrel configuration
    - `amount_to_add`: Cost to add to the pen
    - `row_id`: ID of the pen to update

## Dependencies
- Supabase client for database operations
- JWT for session management
- Configurator functions for component creation

## Key Differences from Cap Configuration
- Includes `grip_type` and `shape` fields specific to barrel design
- Does not include `clip_design` configuration (cap-specific feature)
- Uses `BarrelConfig` table instead of `CapConfig`
- Uses `update_barrel_details` RPC instead of `update_cap_details`
- Note: There's a typo in the code where `shape` is referenced as `sahpe`

## Notes
- All component costs are automatically calculated and summed
- The endpoint supports partial configurations (not all components required)
- Session management allows for multi-step pen configuration
- HTTP-only cookies ensure secure session handling
- Barrel configuration is essential for pen ergonomics and user experience
