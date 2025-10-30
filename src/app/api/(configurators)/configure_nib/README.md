# Configure Nib API Endpoint

## Overview
This API endpoint handles the configuration of pen nibs by creating custom nib designs with various materials, designs, and sizes. The nib configuration is crucial for determining writing style, flow, and user experience.

## Endpoint
```
POST /api/configure_nib
```

## Authentication
- Uses JWT token stored in HTTP-only cookie named "pen"
- Token contains `penId` for tracking pen configuration sessions
- Token expires in 48 hours

## Request Body

### Required Fields
- `description` (string): Description of the nib configuration
- `size` (string): Size of the nib (e.g., "Fine", "Medium", "Broad")

### Optional Fields

#### Material Configuration
```json
{
  "material": {
    "name": "string" // Material name for the nib
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

## Example Request
```json
{
  "description": "Premium gold nib with fine point",
  "size": "Fine",
  "material": {
    "name": "Gold"
  },
  "design": {
    "description": "Classic nib design with scroll pattern",
    "font": "Serif",
    "colour": "Gold",
    "hex_code": "#FFD700"
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
- **Body**: `"New pen created with Nib"`

### Error Responses

#### No Data Sent
- **Status**: 400 Bad Request
- **Body**: `"NO DATA SENT"`

#### Nib Creation Error
- **Status**: 400 Bad Request
- **Body**: Error details from database operations

#### Token Decode Error
- **Status**: 400 Bad Request
- **Body**: `"Unable to decode cookie"`

#### Database Errors
- **Status**: 400 Bad Request
- **Body**: Error details from database operations

## Business Logic

1. **Validation**: Checks if request body exists
2. **Component Creation**: Creates optional components (material, design) if provided
3. **Cost Calculation**: Automatically calculates total cost by summing material and design costs
4. **Database Storage**: Inserts nib configuration into `NibConfig` table
5. **Pen Management**:
   - If pen session exists: Updates existing pen with nib configuration using `update_nib_details` RPC
   - If no session: Creates new pen with nib configuration and sets cookie
6. **Session Tracking**: Uses JWT cookies to maintain pen configuration state

## Database Tables Used
- `NibConfig`: Stores nib configuration details
- `Pen`: Stores pen records and references
- Various component tables for materials and designs

## Database Functions Used
- `update_nib_details`: RPC function to update existing pen with nib configuration
  - Parameters:
    - `new_nibtype_id`: ID of the created nib configuration
    - `amount_to_add`: Cost to add to the pen
    - `row_id`: ID of the pen to update

## Dependencies
- Supabase client for database operations
- JWT for session management
- Configurator functions for component creation (`createMaterial`, `createDesign`)

## Key Features
- **Size Configuration**: Supports various nib sizes (Fine, Medium, Broad, etc.)
- **Material Support**: Optional material selection for nib construction
- **Design Customization**: Optional design patterns and colors
- **Dynamic Pricing**: Cost calculated based on selected components
- **Session Integration**: Seamlessly integrates with pen configuration workflow

## Common Nib Sizes
- **Extra Fine (EF)**: Very thin lines, precise writing
- **Fine (F)**: Thin lines, good for detailed work
- **Medium (M)**: Standard thickness, versatile
- **Broad (B)**: Thick lines, bold writing
- **Stub**: Flat tip for calligraphy-style writing

## Notes
- Nib configuration is essential for writing experience and style
- Material choice affects durability, flexibility, and writing feel
- Design elements can include engravings, patterns, or decorative elements
- Cost is dynamically calculated based on selected optional components
- The endpoint supports partial configurations (not all components required)
- Session management allows for multi-step pen configuration
- HTTP-only cookies ensure secure session handling

## Nib Configuration Schema
The nib configuration stores:
- **Description**: User-defined description
- **Size**: Nib size specification
- **Material ID**: Reference to selected material (optional)
- **Design ID**: Reference to selected design (optional)
- **Cost**: Calculated total cost of components
