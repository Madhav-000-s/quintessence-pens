// Script to create 10 demo work orders with "in production" status
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kgjxqskzdqdqbazmmhci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnanhxc2t6ZHFkcWJhem1taGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUyNTUyMywiZXhwIjoyMDQ1MTAxNTIzfQ.kdYVa7AZYW2l1_EXxj6q7HVGzlOzWqvXi69LgdmF1jU';

const supabase = createClient(supabaseUrl, supabaseKey);

const workOrders = [
  {customer_id: 2, pen: 6, count: 25, defective: 0, unit_cost: 899.99, subtotal: 22499.75, tax_amt: 4049.96, grand_total: 26549.71, start_date: '2025-10-20', status: 'in production'},
  {customer_id: 5, pen: 7, count: 15, defective: 0, unit_cost: 1099.99, subtotal: 16499.85, tax_amt: 2969.97, grand_total: 19469.82, start_date: '2025-10-22', status: 'in production'},
  {customer_id: 2, pen: 5, count: 30, defective: 0, unit_cost: 749.99, subtotal: 22499.70, tax_amt: 4049.95, grand_total: 26549.65, start_date: '2025-10-18', status: 'in production'},
  {customer_id: 5, pen: 6, count: 12, defective: 0, unit_cost: 899.99, subtotal: 10799.88, tax_amt: 1943.98, grand_total: 12743.86, start_date: '2025-10-25', status: 'in production'},
  {customer_id: 2, pen: 7, count: 20, defective: 0, unit_cost: 1099.99, subtotal: 21999.80, tax_amt: 3959.96, grand_total: 25959.76, start_date: '2025-10-23', status: 'in production'},
  {customer_id: 5, pen: 5, count: 18, defective: 0, unit_cost: 749.99, subtotal: 13499.82, tax_amt: 2429.97, grand_total: 15929.79, start_date: '2025-10-26', status: 'in production'},
  {customer_id: 2, pen: 6, count: 22, defective: 0, unit_cost: 899.99, subtotal: 19799.78, tax_amt: 3563.96, grand_total: 23363.74, start_date: '2025-10-27', status: 'in production'},
  {customer_id: 5, pen: 7, count: 10, defective: 0, unit_cost: 1099.99, subtotal: 10999.90, tax_amt: 1979.98, grand_total: 12979.88, start_date: '2025-10-28', status: 'in production'},
  {customer_id: 2, pen: 5, count: 28, defective: 0, unit_cost: 749.99, subtotal: 20999.72, tax_amt: 3779.95, grand_total: 24779.67, start_date: '2025-10-29', status: 'in production'},
  {customer_id: 5, pen: 6, count: 16, defective: 0, unit_cost: 899.99, subtotal: 14399.84, tax_amt: 2591.97, grand_total: 16991.81, start_date: '2025-10-30', status: 'in production'}
];

async function createOrders() {
  const { data, error } = await supabase
    .from('WorkOrder')
    .insert(workOrders)
    .select();

  if (error) {
    console.error('Error creating work orders:', error);
    return;
  }

  console.log(`Successfully created ${data.length} demo work orders!`);
  console.log('Work Order IDs:', data.map(wo => wo.id).join(', '));
}

createOrders();
