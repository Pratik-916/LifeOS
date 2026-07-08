import React, { useState, useMemo } from 'react';
import {    } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useJourneyData } from '../hooks/useJourneyData';
import type { TimelineYear as ITimelineYear } from '../hooks/useJourneyData';
import { JourneyStatistics } from '../components/journey/JourneyStatistics';
import { Timeline } from '../components/journey/Timeline';
import { MemoryModal } from '../components/journey/MemoryModal';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { useAppStore } from '../store/useAppStore';

const EVENT_TYPES = ['All', 'goal', 'milestone', 'journal', 'habit', 'task', 'memory'];

export default function Journey() {
  const { timeline, stats } = useJourneyData();
  const { addMemory } = useAppStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredTimeline = useMemo(() => {
    if (selectedType === 'All' && !searchQuery.trim()) return timeline;
    
    const query = searchQuery.toLowerCase();
    
    return timeline.map(year => {
      const filteredMonths = year.months.map(month => {
        const filteredEvents = month.events.filter(event => {
          const matchesType = selectedType === 'All' || event.type === selectedType;
          const matchesSearch = !query || 
            event.title.toLowerCase().includes(query) || 
            (event.description && event.description.toLowerCase().includes(query));
          return matchesType && matchesSearch;
        });
        
        return { ...month, events: filteredEvents };
      }).filter(month => month.events.length > 0);
      
      return { ...year, months: filteredMonths };
    }).filter(year => year.months.length > 0);
  }, [timeline, searchQuery, selectedType]);

  const handleAddMemory = (memoryData: any) => {
    addMemory(memoryData);
  };

  return (
    <div className="pb-20 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <PageHeader
        title="The Journey"
        description="A look back at the years that shaped the present."
        actionLabel="Add Memory"
        onAction={() => setIsModalOpen(true)}
      />

      <JourneyStatistics stats={stats} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-surfaceHighlight p-4 rounded-2xl border border-border/20">
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search your journey..."
          />
        </div>
        <FilterBar
          filters={[
            {
              id: 'event-type',
              label: 'Event Type',
              options: EVENT_TYPES.map(t => ({ label: t === 'All' ? 'All Events' : t.charAt(0).toUpperCase() + t.slice(1), value: t })),
              value: selectedType,
              onChange: setSelectedType
            }
          ]}
        />
      </div>

      {/* Timeline Container */}
      <div className="pt-8">
        <Timeline timeline={filteredTimeline} />
      </div>

      <MemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMemory}
      />
      
    </div>
  );
}
