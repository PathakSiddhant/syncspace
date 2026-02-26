"use client";

import { useEditor, createShapeId, toRichText } from "tldraw";
import { 
  LayoutTemplate, X, Columns, GitMerge, 
  Grid2x2, History, CalendarDays, Target, 
  Workflow, Lightbulb, User, Clock, ThumbsUp, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardTemplatesProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BoardTemplates({ isOpen, onToggle }: BoardTemplatesProps) {
  const editor = useEditor();

  const handleInsertTemplate = (type: string) => {
    const camera = editor.getCamera();
    const sX = camera.x + 100; // Start X
    const sY = camera.y + 100; // Start Y

    const shapes: any[] = [];

    // ==========================================
    // 📁 CATEGORY 1: AGILE & WORKFLOWS
    // ==========================================
    
    if (type === "kanban") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 1050, h: 800, name: '🚀 Sprint Kanban Board' } },
        // To Do Column
        { id: createShapeId(), type: 'geo', x: sX, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'grey' } },
        { id: createShapeId(), type: 'text', x: sX + 100, y: sY + 12, props: { richText: toRichText('To Do 📌'), size: 'm', align: 'middle' } },
        { id: createShapeId(), type: 'geo', x: sX, y: sY + 70, props: { w: 300, h: 600, geo: 'rectangle', fill: 'semi', color: 'grey' } },
        { id: createShapeId(), type: 'note', x: sX + 50, y: sY + 100, props: { color: 'yellow', richText: toRichText('Task 1') } },
        // In Progress Column
        { id: createShapeId(), type: 'geo', x: sX + 350, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'blue' } },
        { id: createShapeId(), type: 'text', x: sX + 410, y: sY + 12, props: { richText: toRichText('In Progress 🚀'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'geo', x: sX + 350, y: sY + 70, props: { w: 300, h: 600, geo: 'rectangle', fill: 'semi', color: 'light-blue' } },
        { id: createShapeId(), type: 'note', x: sX + 400, y: sY + 100, props: { color: 'blue', richText: toRichText('Doing this right now') } },
        // Done Column
        { id: createShapeId(), type: 'geo', x: sX + 700, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'green' } },
        { id: createShapeId(), type: 'text', x: sX + 800, y: sY + 12, props: { richText: toRichText('Done ✅'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'geo', x: sX + 700, y: sY + 70, props: { w: 300, h: 600, geo: 'rectangle', fill: 'semi', color: 'light-green' } },
        { id: createShapeId(), type: 'note', x: sX + 750, y: sY + 100, props: { color: 'green', richText: toRichText('Finished Task') } }
      );
    } 
    else if (type === "retro") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 1050, h: 800, name: '🔄 Sprint Retrospective' } },
        { id: createShapeId(), type: 'geo', x: sX, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'green' } },
        { id: createShapeId(), type: 'text', x: sX + 80, y: sY + 12, props: { richText: toRichText('Went Well 😊'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'note', x: sX + 50, y: sY + 90, props: { color: 'green', richText: toRichText('Shipped new feature!') } },
        { id: createShapeId(), type: 'geo', x: sX + 350, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'red' } },
        { id: createShapeId(), type: 'text', x: sX + 410, y: sY + 12, props: { richText: toRichText('To Improve 🧐'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'note', x: sX + 400, y: sY + 90, props: { color: 'red', richText: toRichText('Too many bugs') } },
        { id: createShapeId(), type: 'geo', x: sX + 700, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'violet' } },
        { id: createShapeId(), type: 'text', x: sX + 760, y: sY + 12, props: { richText: toRichText('Action Items 🎯'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'note', x: sX + 750, y: sY + 90, props: { color: 'violet', richText: toRichText('Fix the API bug') } }
      );
    }
    else if (type === "standup") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 1050, h: 600, name: '🌅 Daily Standup' } },
        { id: createShapeId(), type: 'geo', x: sX, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'grey' } },
        { id: createShapeId(), type: 'text', x: sX + 70, y: sY + 12, props: { richText: toRichText('Done Yesterday'), size: 'm' } },
        { id: createShapeId(), type: 'note', x: sX + 50, y: sY + 90, props: { color: 'light-blue', richText: toRichText('Designed UI') } },
        { id: createShapeId(), type: 'geo', x: sX + 350, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'blue' } },
        { id: createShapeId(), type: 'text', x: sX + 440, y: sY + 12, props: { richText: toRichText('Doing Today'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'note', x: sX + 400, y: sY + 90, props: { color: 'yellow', richText: toRichText('Writing API') } },
        { id: createShapeId(), type: 'geo', x: sX + 700, y: sY, props: { w: 300, h: 60, geo: 'rectangle', fill: 'solid', color: 'red' } },
        { id: createShapeId(), type: 'text', x: sX + 800, y: sY + 12, props: { richText: toRichText('Blockers'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'note', x: sX + 750, y: sY + 90, props: { color: 'light-red', richText: toRichText('Waiting for design') } }
      );
    }
    else if (type === "flowchart") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 1000, h: 400, name: '⚙️ Process Flowchart' } },
        { id: createShapeId(), type: 'geo', x: sX, y: sY + 100, props: { w: 150, h: 80, geo: 'ellipse', fill: 'solid', color: 'green' } },
        { id: createShapeId(), type: 'text', x: sX + 45, y: sY + 125, props: { richText: toRichText('Start'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'geo', x: sX + 250, y: sY + 100, props: { w: 200, h: 80, geo: 'rectangle', fill: 'semi', color: 'blue' } },
        { id: createShapeId(), type: 'text', x: sX + 290, y: sY + 125, props: { richText: toRichText('Process Step'), size: 'm' } },
        { id: createShapeId(), type: 'geo', x: sX + 550, y: sY + 50, props: { w: 180, h: 180, geo: 'diamond', fill: 'semi', color: 'orange' } },
        { id: createShapeId(), type: 'text', x: sX + 590, y: sY + 125, props: { richText: toRichText('Decision?'), size: 'm' } },
        { id: createShapeId(), type: 'geo', x: sX + 800, y: sY + 100, props: { w: 150, h: 80, geo: 'ellipse', fill: 'solid', color: 'red' } },
        { id: createShapeId(), type: 'text', x: sX + 850, y: sY + 125, props: { richText: toRichText('End'), size: 'm', color: 'white' } }
      );
    }

    // ==========================================
    // 📊 CATEGORY 2: STRATEGY & ANALYSIS
    // ==========================================

    else if (type === "swot") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 800, h: 800, name: '📊 SWOT Analysis' } },
        { id: createShapeId(), type: 'geo', x: sX, y: sY, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'light-green' } },
        { id: createShapeId(), type: 'text', x: sX + 20, y: sY + 20, props: { richText: toRichText('Strengths (Internal)'), size: 'l', color: 'green' } },
        { id: createShapeId(), type: 'note', x: sX + 40, y: sY + 80, props: { color: 'green', richText: toRichText('What are we good at?') } },
        
        { id: createShapeId(), type: 'geo', x: sX + 370, y: sY, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'light-red' } },
        { id: createShapeId(), type: 'text', x: sX + 390, y: sY + 20, props: { richText: toRichText('Weaknesses (Internal)'), size: 'l', color: 'red' } },
        { id: createShapeId(), type: 'note', x: sX + 410, y: sY + 80, props: { color: 'red', richText: toRichText('What lacks right now?') } },
        
        { id: createShapeId(), type: 'geo', x: sX, y: sY + 370, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'light-blue' } },
        { id: createShapeId(), type: 'text', x: sX + 20, y: sY + 390, props: { richText: toRichText('Opportunities (External)'), size: 'l', color: 'blue' } },
        { id: createShapeId(), type: 'note', x: sX + 40, y: sY + 450, props: { color: 'blue', richText: toRichText('Market trends we can use?') } },
        
        { id: createShapeId(), type: 'geo', x: sX + 370, y: sY + 370, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'orange' } },
        { id: createShapeId(), type: 'text', x: sX + 390, y: sY + 390, props: { richText: toRichText('Threats (External)'), size: 'l', color: 'orange' } },
        { id: createShapeId(), type: 'note', x: sX + 410, y: sY + 450, props: { color: 'orange', richText: toRichText('Competitor actions?') } }
      );
    }
    else if (type === "eisenhower") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 800, h: 800, name: '🎯 Eisenhower Matrix' } },
        { id: createShapeId(), type: 'geo', x: sX, y: sY, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'light-green' } },
        { id: createShapeId(), type: 'text', x: sX + 20, y: sY + 20, props: { richText: toRichText('DO FIRST (Urgent & Important)'), size: 'm', color: 'green' } },
        { id: createShapeId(), type: 'note', x: sX + 40, y: sY + 80, props: { color: 'green', richText: toRichText('Do it immediately') } },
        
        { id: createShapeId(), type: 'geo', x: sX + 370, y: sY, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'light-blue' } },
        { id: createShapeId(), type: 'text', x: sX + 390, y: sY + 20, props: { richText: toRichText('SCHEDULE (Important, Not Urgent)'), size: 'm', color: 'blue' } },
        { id: createShapeId(), type: 'note', x: sX + 410, y: sY + 80, props: { color: 'blue', richText: toRichText('Plan for later') } },
        
        { id: createShapeId(), type: 'geo', x: sX, y: sY + 370, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'yellow' } },
        { id: createShapeId(), type: 'text', x: sX + 20, y: sY + 390, props: { richText: toRichText('DELEGATE (Urgent, Not Important)'), size: 'm', color: 'yellow' } },
        { id: createShapeId(), type: 'note', x: sX + 40, y: sY + 450, props: { color: 'yellow', richText: toRichText('Who can do this?') } },
        
        { id: createShapeId(), type: 'geo', x: sX + 370, y: sY + 370, props: { w: 350, h: 350, geo: 'rectangle', fill: 'semi', color: 'light-red' } },
        { id: createShapeId(), type: 'text', x: sX + 390, y: sY + 390, props: { richText: toRichText('DON\'T DO (Not Urgent/Important)'), size: 'm', color: 'red' } },
        { id: createShapeId(), type: 'note', x: sX + 410, y: sY + 450, props: { color: 'red', richText: toRichText('Eliminate this task') } }
      );
    }
    else if (type === "proscons") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 800, h: 600, name: '⚖️ Pros & Cons' } },
        { id: createShapeId(), type: 'geo', x: sX, y: sY, props: { w: 350, h: 60, geo: 'rectangle', fill: 'solid', color: 'green' } },
        { id: createShapeId(), type: 'text', x: sX + 130, y: sY + 12, props: { richText: toRichText('PROS 🟢'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'note', x: sX + 75, y: sY + 90, props: { color: 'green', richText: toRichText('Advantage 1') } },
        
        { id: createShapeId(), type: 'geo', x: sX + 370, y: sY, props: { w: 350, h: 60, geo: 'rectangle', fill: 'solid', color: 'red' } },
        { id: createShapeId(), type: 'text', x: sX + 500, y: sY + 12, props: { richText: toRichText('CONS 🔴'), size: 'm', color: 'white' } },
        { id: createShapeId(), type: 'note', x: sX + 445, y: sY + 90, props: { color: 'red', richText: toRichText('Disadvantage 1') } }
      );
    }

    // ==========================================
    // 🧠 CATEGORY 3: IDEATION & PROBLEM SOLVING
    // ==========================================

    else if (type === "brainstorm") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 900, h: 600, name: '💡 Brainstorming Cloud' } },
        { id: createShapeId(), type: 'geo', x: sX + 250, y: sY + 150, props: { w: 300, h: 200, geo: 'cloud', fill: 'solid', color: 'yellow' } },
        { id: createShapeId(), type: 'text', x: sX + 295, y: sY + 220, props: { richText: toRichText('Core Concept'), size: 'xl' } },
        { id: createShapeId(), type: 'note', x: sX + 50, y: sY + 50, props: { color: 'blue', richText: toRichText('Idea 1') } },
        { id: createShapeId(), type: 'note', x: sX + 550, y: sY + 50, props: { color: 'green', richText: toRichText('Idea 2') } },
        { id: createShapeId(), type: 'note', x: sX + 50, y: sY + 350, props: { color: 'red', richText: toRichText('Idea 3') } },
        { id: createShapeId(), type: 'note', x: sX + 550, y: sY + 350, props: { color: 'violet', richText: toRichText('Idea 4') } }
      );
    }
    else if (type === "5whys") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 800, h: 800, name: '❓ 5 Whys Root Cause' } },
        { id: createShapeId(), type: 'geo', x: sX + 250, y: sY, props: { w: 300, h: 80, geo: 'rectangle', fill: 'solid', color: 'red' } },
        { id: createShapeId(), type: 'text', x: sX + 290, y: sY + 20, props: { richText: toRichText('The Problem'), size: 'l', color: 'white' } },
        
        { id: createShapeId(), type: 'note', x: sX + 300, y: sY + 120, props: { color: 'orange', richText: toRichText('Why? (1)') } },
        { id: createShapeId(), type: 'note', x: sX + 300, y: sY + 240, props: { color: 'orange', richText: toRichText('Why? (2)') } },
        { id: createShapeId(), type: 'note', x: sX + 300, y: sY + 360, props: { color: 'orange', richText: toRichText('Why? (3)') } },
        { id: createShapeId(), type: 'note', x: sX + 300, y: sY + 480, props: { color: 'orange', richText: toRichText('Why? (4)') } },
        { id: createShapeId(), type: 'note', x: sX + 300, y: sY + 600, props: { color: 'green', richText: toRichText('Root Cause! (5)') } }
      );
    }

    // ==========================================
    // 🎨 CATEGORY 4: PRODUCT & DESIGN
    // ==========================================

    else if (type === "persona") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 850, h: 600, name: '👤 User Persona' } },
        // Profile side
        { id: createShapeId(), type: 'geo', x: sX, y: sY, props: { w: 250, h: 500, geo: 'rectangle', fill: 'semi', color: 'grey' } },
        { id: createShapeId(), type: 'geo', x: sX + 50, y: sY + 30, props: { w: 150, h: 150, geo: 'ellipse', fill: 'solid', color: 'light-blue' } },
        { id: createShapeId(), type: 'text', x: sX + 70, y: sY + 200, props: { richText: toRichText('Name: Alex'), size: 'm' } },
        { id: createShapeId(), type: 'text', x: sX + 15, y: sY + 250, props: { richText: toRichText('Age: 28\nRole: Developer\nLocation: Remote'), size: 's' } },
        // Goals & Frustrations
        { id: createShapeId(), type: 'geo', x: sX + 280, y: sY, props: { w: 500, h: 240, geo: 'rectangle', fill: 'semi', color: 'light-green' } },
        { id: createShapeId(), type: 'text', x: sX + 300, y: sY + 20, props: { richText: toRichText('Goals & Needs 🎯'), size: 'l', color: 'green' } },
        { id: createShapeId(), type: 'note', x: sX + 300, y: sY + 70, props: { color: 'green', richText: toRichText('Wants to build fast apps') } },
        { id: createShapeId(), type: 'geo', x: sX + 280, y: sY + 260, props: { w: 500, h: 240, geo: 'rectangle', fill: 'semi', color: 'light-red' } },
        { id: createShapeId(), type: 'text', x: sX + 300, y: sY + 280, props: { richText: toRichText('Frustrations 😤'), size: 'l', color: 'red' } },
        { id: createShapeId(), type: 'note', x: sX + 300, y: sY + 330, props: { color: 'red', richText: toRichText('Hates slow UI') } }
      );
    }
    else if (type === "empathy") {
      shapes.push(
        { id: createShapeId(), type: 'frame', x: sX - 50, y: sY - 50, props: { w: 850, h: 850, name: '❤️ Empathy Map' } },
        { id: createShapeId(), type: 'geo', x: sX + 300, y: sY + 300, props: { w: 150, h: 150, geo: 'ellipse', fill: 'solid', color: 'yellow' } },
        { id: createShapeId(), type: 'text', x: sX + 340, y: sY + 360, props: { richText: toRichText('User'), size: 'l' } },
        
        { id: createShapeId(), type: 'text', x: sX + 100, y: sY + 50, props: { richText: toRichText('SAYS 💬'), size: 'xl' } },
        { id: createShapeId(), type: 'note', x: sX + 50, y: sY + 120, props: { color: 'light-blue', richText: toRichText('"This app is hard to use"') } },
        
        { id: createShapeId(), type: 'text', x: sX + 550, y: sY + 50, props: { richText: toRichText('THINKS 🧠'), size: 'xl' } },
        { id: createShapeId(), type: 'note', x: sX + 500, y: sY + 120, props: { color: 'violet', richText: toRichText('Why is this button hidden?') } },
        
        { id: createShapeId(), type: 'text', x: sX + 100, y: sY + 650, props: { richText: toRichText('DOES 🛠️'), size: 'xl' } },
        { id: createShapeId(), type: 'note', x: sX + 50, y: sY + 500, props: { color: 'orange', richText: toRichText('Clicks the wrong menu') } },
        
        { id: createShapeId(), type: 'text', x: sX + 550, y: sY + 650, props: { richText: toRichText('FEELS ❤️'), size: 'xl' } },
        { id: createShapeId(), type: 'note', x: sX + 500, y: sY + 500, props: { color: 'red', richText: toRichText('Frustrated and confused') } }
      );
    }

    editor.createShapes(shapes as any[]);
    
    // Zoom out beautifully like Miro!
    setTimeout(() => {
      editor.zoomToFit({ animation: { duration: 500 } });
    }, 100);

    onToggle(); 
  };

  return (
    <div className="relative flex items-center">
      <Button
        onClick={onToggle}
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-md transition-all ${isOpen ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-transparent hover:bg-white/8 text-neutral-400 hover:text-white"}`}
        title="Template Library"
      >
        <LayoutTemplate className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[320px] bg-[#111111]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-[99999]">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.03] shrink-0">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-amber-400" />
              Template Library
            </h3>
            <button onClick={onToggle} className="text-neutral-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* 🔥 The Epic Scrollable Menu */}
          <div className="p-2 flex flex-col max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            
            {/* 1. Agile & Workflows */}
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Agile & Workflows</div>
            <Button onClick={() => handleInsertTemplate("kanban")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-indigo-500/10 hover:text-indigo-300 font-medium rounded-xl mb-1 transition-colors">
              <Columns className="w-4 h-4 text-indigo-400" /> Sprint Kanban
            </Button>
            <Button onClick={() => handleInsertTemplate("retro")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-emerald-500/10 hover:text-emerald-300 font-medium rounded-xl mb-1 transition-colors">
              <History className="w-4 h-4 text-emerald-400" /> Retrospective
            </Button>
            <Button onClick={() => handleInsertTemplate("standup")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-blue-500/10 hover:text-blue-300 font-medium rounded-xl mb-1 transition-colors">
              <Clock className="w-4 h-4 text-blue-400" /> Daily Standup
            </Button>
            <Button onClick={() => handleInsertTemplate("flowchart")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-orange-500/10 hover:text-orange-300 font-medium rounded-xl mb-2 transition-colors">
              <Workflow className="w-4 h-4 text-orange-400" /> Process Flowchart
            </Button>

            {/* 2. Strategy & Analysis */}
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-t border-white/5 mt-1 pt-3">Strategy & Analysis</div>
            <Button onClick={() => handleInsertTemplate("swot")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-purple-500/10 hover:text-purple-300 font-medium rounded-xl mb-1 transition-colors">
              <Grid2x2 className="w-4 h-4 text-purple-400" /> SWOT Analysis
            </Button>
            <Button onClick={() => handleInsertTemplate("eisenhower")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-red-500/10 hover:text-red-300 font-medium rounded-xl mb-1 transition-colors">
              <Target className="w-4 h-4 text-red-400" /> Eisenhower Matrix
            </Button>
            <Button onClick={() => handleInsertTemplate("proscons")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-green-500/10 hover:text-green-300 font-medium rounded-xl mb-2 transition-colors">
              <ThumbsUp className="w-4 h-4 text-green-400" /> Pros & Cons List
            </Button>

            {/* 3. Ideation */}
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-t border-white/5 mt-1 pt-3">Ideation & Problem Solving</div>
            <Button onClick={() => handleInsertTemplate("brainstorm")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-yellow-500/10 hover:text-yellow-300 font-medium rounded-xl mb-1 transition-colors">
              <Lightbulb className="w-4 h-4 text-yellow-400" /> Brainstorming Cloud
            </Button>
            <Button onClick={() => handleInsertTemplate("5whys")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-orange-500/10 hover:text-orange-300 font-medium rounded-xl mb-2 transition-colors">
              <HelpCircle className="w-4 h-4 text-orange-400" /> 5 Whys Analysis
            </Button>

            {/* 4. Product & Design */}
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-t border-white/5 mt-1 pt-3">Product & Design</div>
            <Button onClick={() => handleInsertTemplate("persona")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-cyan-500/10 hover:text-cyan-300 font-medium rounded-xl mb-1 transition-colors">
              <User className="w-4 h-4 text-cyan-400" /> User Persona
            </Button>
            <Button onClick={() => handleInsertTemplate("empathy")} variant="ghost" className="w-full justify-start gap-3 h-10 text-neutral-300 hover:text-white hover:bg-pink-500/10 hover:text-pink-300 font-medium rounded-xl mb-1 transition-colors">
              <GitMerge className="w-4 h-4 text-pink-400" /> Empathy Map
            </Button>

          </div>
        </div>
      )}
    </div>
  );
}