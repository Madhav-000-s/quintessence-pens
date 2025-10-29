# Configure Cap API Endpoint

## Overview
This API endpoint handles the configuration of pen caps by creating custom cap designs with various materials, designs, engravings, clip designs, and coatings.

## Endpoint
```
POST /api/configure_cap
```

## Authentication
- Uses JWT token stored in HTTP-only cookie named "pen"
- Token contains `penId` for tracking pen configuration sessions
- Token expires in 48 hours

## Request Body

### Required Fields
- `description` (string): Description of the cap configuration

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

#### Clip Design Configuration
```json
{
  "clip_design": {
    "description": "string", // Clip design description
    "material": "string",    // Clip material
    "design": "string",      // Clip design pattern
    "engraving": "string"    // Clip engraving details
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
  "description": "Premium gold cap with custom engraving",
  "material": {
    "name": "Gold"
  },
  "design": {
    "description": "Elegant swirl pattern",
    "font": "Times New Roman",
    "colour": "Gold",
    "hex_code": "#FFD700"
  },
  "engraving": {
    "font": "Script",
    "type_name": "Laser",
    "description": "Personal monogram"
  },
  "clip_design": {
    "description": "Classic clip with logo",
    "material": "Gold",
    "design": "Traditional",
    "engraving": "Company logo"
  },
  "coating": {
    "colour": "Matte",
    "hex_code": "#C0C0C0",
    "type": "Protective"
  }
}
```

## Response

### Success Responses

#### Existing Pen (Cookie Present)
- **Status**: 200 OK
- **Body**: `"Cap added to Pen"`

#### New Pen Creation
- **Status**: 201 Created
- **Headers**: 
  - `Set-Cookie`: JWT token for pen session
- **Body**: `"New pen created with cap"`

### Error Responses

#### No Data Sent
- **Status**: 400 Bad Request
- **Body**: `"NO DATA SENT"`

#### Token Decode Error
- **Status**: 404 Not Found
- **Body**: `"Not able to decode token"`

#### Database Errors
- **Status**: 400 Bad Request
- **Body**: Error details from database operations

## Business Logic

1. **Validation**: Checks if request body exists
2. **Component Creation**: Creates optional components (material, design, engraving, clip_design, coating) if provided
3. **Cost Calculation**: Automatically calculates total cost by summing individual component costs
4. **Database Storage**: Inserts cap configuration into `CapConfig` table
5. **Pen Management**:
   - If pen session exists: Updates existing pen with cap configuration
   - If no session: Creates new pen with cap configuration and sets cookie
6. **Session Tracking**: Uses JWT cookies to maintain pen configuration state

## Database Tables Used
- `CapConfig`: Stores cap configuration details
- `Pen`: Stores pen records and references
- Various component tables for materials, designs, engravings, etc.

## Dependencies
- Supabase client for database operations
- JWT for session management
- Configurator functions for component creation

## Notes
- All component costs are automatically calculated and summed
- The endpoint supports partial configurations (not all components required)
- Session management allows for multi-step pen configuration
- HTTP-only cookies ensure secure session handling
