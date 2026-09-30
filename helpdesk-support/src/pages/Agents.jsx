import { useEffect, useMemo, useState } from 'react'
import { Eye, Search, Users } from 'lucide-react'
import agentData from '../data/agentData'
import AgentDetailsModal from '../components/AgentDetailsModal'
import './Agents.css'

function Agents () {
  const [agents, setAgents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedAgent, setSelectedAgent] = useState(null)

  useEffect(() => {
    try {
      const savedAgents = localStorage.getItem('supportmateAgents')

      if (savedAgents) {
        setAgents(JSON.parse(savedAgents))
      } else {
        localStorage.setItem('supportmateAgents', JSON.stringify(agentData))
        setAgents(agentData)
      }
    } catch {
      setAgents(agentData)

      localStorage.setItem('supportmateAgents', JSON.stringify(agentData))
    }
  }, [])

  const filteredAgents = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase()

    return agents.filter(agent => {
      const name = agent.name?.toLowerCase() || ''

      const email = agent.email?.toLowerCase() || ''

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue)

      const matchesRole = roleFilter === 'All' || agent.role === roleFilter

      const matchesStatus =
        statusFilter === 'All' || agent.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [agents, searchTerm, roleFilter, statusFilter])

  const getStatusClass = status => {
    return status.toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <div className='agents-page'>
      <div className='agents-header'>
        <div>
          <span className='agents-eyebrow'>TEAM MANAGEMENT</span>

          <h1>Agents</h1>

          <p>Manage your support team members and workload.</p>
        </div>

        <div className='agents-total'>
          <Users size={17} />
          <span>{agents.length} Agents</span>
        </div>
      </div>

      <div className='agents-toolbar'>
        <div className='agents-search'>
          <Search size={16} />

          <input
            type='text'
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder='Search agents...'
          />
        </div>

        <select
          value={roleFilter}
          onChange={event => setRoleFilter(event.target.value)}
          className='agents-filter'
        >
          <option value='All'>All Roles</option>

          <option value='Senior Support'>Senior Support</option>

          <option value='Support Agent'>Support Agent</option>

          <option value='Support Admin'>Support Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value)}
          className='agents-filter'
        >
          <option value='All'>All Status</option>

          <option value='Available'>Available</option>

          <option value='Busy'>Busy</option>

          <option value='Offline'>Offline</option>
        </select>
      </div>

      <div className='agents-table-card'>
        <div className='agents-table-header'>
          <div>
            <h2>Support Team</h2>

            <p>{filteredAgents.length} agents found</p>
          </div>
        </div>

        {filteredAgents.length === 0 ? (
          <div className='agents-empty-state'>
            <Users size={28} />

            <h3>No agents found</h3>

            <p>Try changing your search or filter options.</p>
          </div>
        ) : (
          <div className='agents-table-wrapper'>
            <table className='agents-table'>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Role</th>
                  <th>Open Tickets</th>
                  <th>Resolved</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAgents.map(agent => (
                  <tr
                    key={agent.id}
                    className='agent-row'
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <td>
                      <div className='agent-profile'>
                        <div className='agent-avatar'>
                          {agent.name
                            .split(' ')
                            .map(word => word.charAt(0))
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className='agent-profile-info'>
                          <strong>{agent.name}</strong>
                          <span>{agent.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{agent.role}</td>

                    <td>
                      <strong className='agent-ticket-count'>
                        {agent.openTickets}
                      </strong>
                    </td>

                    <td>{agent.resolved}</td>

                    <td>
                      <span
                        className={`agent-status ${getStatusClass(
                          agent.status
                        )}`}
                      >
                        <span className='agent-status-dot' />
                        {agent.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type='button'
                        className='agent-view-button'
                        onClick={event => {
                          event.stopPropagation()
                          setSelectedAgent(agent)
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AgentDetailsModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  )
}

export default Agents
