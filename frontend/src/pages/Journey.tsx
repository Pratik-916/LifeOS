import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJourneyTimeline, useJourneyStatistics, useCreateMemory } from '../features/journey/hooks';
import { JourneyStatistics } from '../components/journey/JourneyStatistics';
import { Timeline } from '../components/journey/Timeline';
import { MemoryModal } from '../components/journey/MemoryModal';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { LoadingOverlay } from '../components/ui/loaders/LoadingOverlay';
import { FeatureErrorBoundary } from '../components/ui/FeatureErrorBoundary';

const EVENT_TYPES = ['All', 'goal', 'milestone', 'journal', 'habit', 'task', 'memory'];

function JourneyContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const selectedType = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const { data: timelineData, isLoading: isTimelineLoading } = useJourneyTimeline({
    // Passing this to backend just in case, but timeline_service currently ignores it
    // If backend implements it later, it works automatically.
  });
  const { data: statsData, isLoading: isStatsLoading } = useJourneyStatistics();
  const { mutate: createMemory } = useCreateMemory();

  const handleSearchChange = (val: string) => {
    setSearchParams(prev => {
      if (val) prev.set('search', val);
      else prev.delete('search');
      return prev;
    });
  };

  const handleTypeChange = (val: string) => {
    setSearchParams(prev => {
      if (val && val !== 'All') prev.set('category', val);
      else prev.delete('category');
      return prev;
    });
  };

  const timeline = timelineData?.results || [];
  
  // Temporary frontend filtering until TimelineService supports search/category natively 
  // (per instruction, fallback if backend doesn't aggregate them yet, 
  // but strictly, we don't compute grouping itself).
  const filteredTimeline = React.useMemo(() => {
    if (selectedType === 'All' && !searchQuery.trim()) return timeline;
    
    const query = searchQuery.toLowerCase();
    
    return timeline.map(year => {
      const filteredMonths = year.months.map(month => {
        const filteredEvents = month.events.filter(event => {
          const type = event.entityType || event.type || 'memory';
          const matchesType = selectedType === 'All' || type === selectedType;
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
    createMemory(memoryData);
  };

  return (
    <div className="pb-20 max-w-5xl mx-auto space-y-8 relative">
      {(isTimelineLoading || isStatsLoading) && <LoadingOverlay message="Loading Journey..." />}

      <PageHeader
        title="The Journey"
        description="A look back at the years that shaped the present."
        actionLabel="Add Memory"
        onAction={() => setIsModalOpen(true)}
      />

      {statsData && <JourneyStatistics stats={statsData} />}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-surfaceHighlight p-4 rounded-2xl border border-border/20">
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
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
              onChange: handleTypeChange
            }
          ]}
        />
      </div>

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

export default function Journey() {
  return (
    <FeatureErrorBoundary featureName="Journey">
      <JourneyContent />
    </FeatureErrorBoundary>
  );
}
