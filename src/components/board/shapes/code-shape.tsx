import { HTMLContainer, ShapeUtil, TLBaseShape, Rectangle2d } from "tldraw";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 🔥 FIX: Added originalW and originalH to track the baseline for scaling
export type CodeSnippetShape = TLBaseShape<
  "code-snippet",
  { code: string; language: string; w: number; h: number; originalW: number; originalH: number }
>;

export class CodeSnippetShapeUtil extends ShapeUtil<CodeSnippetShape> {
  static override type = "code-snippet" as const;

  // Allows arrows to connect to this shape
  override canBind = () => true;   
  // Allows the user to resize it
  override canResize = () => true; 

  override onResize(shape: CodeSnippetShape, info: any) {
    return {
      props: {
        w: Math.max(100, info.initialBounds.w * info.scaleX),
        h: Math.max(50, info.initialBounds.h * info.scaleY),
      },
    };
  }

  override getDefaultProps(): CodeSnippetShape["props"] {
    return {
      code: "// write code",
      language: "javascript",
      w: 500,
      h: 300,
      originalW: 500,
      originalH: 300,
    };
  }

  override getGeometry(shape: CodeSnippetShape) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true });
  }

  override component(shape: CodeSnippetShape) {
    // 🔥 THE SCALING MAGIC: Calculate how much the user has stretched/shrunk the box
    const scaleX = shape.props.w / shape.props.originalW;
    const scaleY = shape.props.h / shape.props.originalH;

    return (
      // 🔥 THE BINDING FIX: pointerEvents: 'none' lets Tldraw's arrow tool "see" the shape beneath!
      <HTMLContainer style={{ pointerEvents: 'none' }}>
        
        {/* We apply the scale transform here so it behaves EXACTLY like an image/SVG */}
        <div 
          style={{
            width: shape.props.originalW,
            height: shape.props.originalH,
            transform: `scale(${scaleX}, ${scaleY})`,
            transformOrigin: 'top left'
          }}
        >
          <div className="w-full h-full bg-[#282a36] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col border border-white/20 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1e1f29] border-b border-black/40 shrink-0">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-sm" />
              <span className="ml-3 text-[11px] text-neutral-400 font-mono uppercase tracking-widest font-semibold">
                {shape.props.language}
              </span>
            </div>

            <div className="flex-1 overflow-auto text-[14px] scrollbar-hide">
              <SyntaxHighlighter 
                language={shape.props.language} 
                style={dracula}
                customStyle={{ margin: 0, padding: '24px', background: 'transparent', height: '100%' }}
              >
                {shape.props.code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

      </HTMLContainer>
    );
  }

  override indicator(shape: CodeSnippetShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={12} ry={12} fill="none" />;
  }
}