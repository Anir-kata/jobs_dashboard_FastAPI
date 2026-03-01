import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import JobForm from '../JobForm'

vi.mock('../../api', () => ({
  createJob: vi.fn().mockResolvedValue({id:1}),
  bulkCreate: vi.fn().mockResolvedValue([]),
}))

describe('JobForm', () => {
  test('submits form', async () => {
    render(<JobForm />)
    fireEvent.change(screen.getByPlaceholderText('Title'), {target:{value:'X'}})
    fireEvent.click(screen.getByText('Create'))
    expect(await screen.findByPlaceholderText('Title')).toHaveValue('')
  })
})
