import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import JobList from '../JobList'

// mock api
vi.mock('../../api', () => ({
  fetchJobs: vi.fn().mockResolvedValue([{id:1,title:'T1',company:'C1',description:'D'}]),
  searchJobs: vi.fn().mockResolvedValue([{id:1,title:'T1',company:'C1',description:'D'}]),
  deleteJob: vi.fn().mockResolvedValue({ok:true}),
}))

describe('JobList', () => {
  test('renders jobs', async () => {
    render(<JobList />)
    expect(await screen.findByText('T1')).toBeInTheDocument()
  })
})
