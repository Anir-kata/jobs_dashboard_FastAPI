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
    fireEvent.change(screen.getByPlaceholderText('Titre'), {target:{value:'X'}})
    fireEvent.click(screen.getByText('Creer'))
    expect(await screen.findByPlaceholderText('Titre')).toHaveValue('')
  })
})
