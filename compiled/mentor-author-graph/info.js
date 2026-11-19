jQuery.getJSON("/gexf/mentor-author-graph.json",e=>{let t=jQuery("#books");for(let n of e.nodes)if(n.attributes.hasOwnProperty("book")){let s="",o=[];for(let t of e.edges)n.id==t.sourceID?s=t.targetID:n.id==t.targetID&&o.push(t.sourceID);let i=o.map(e=>`<a href="/vis/mentor-author-graph/#${e}">${e}</a>`),a=bookLinks(n.attributes);t.append(`<tr>
                <td data-order="${s}"><a href="/vis/mentor-author-graph/#${s}">${s}</a></td>
                <td data-order="${n.attributes.title}"><a href="/vis/mentor-author-graph/#${n.attributes.title}">${n.attributes.title}</a></td>
                <td data-order="${o.length},${o}">${i.join(" - ")}</td>
                <td>${a.join(" - ")}</td>
            </tr>`)}t.DataTable({columnDefs:[{orderable:!1,targets:3}],info:!1,order:[[2,"desc"]],paging:!1})})